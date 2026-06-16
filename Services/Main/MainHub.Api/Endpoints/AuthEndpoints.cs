using MainHub.Api.Config;
using MainHub.Api.DTOs;
using MainHub.Api.Services;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using System.Web;


namespace MainHub.Api.Endpoints;

public static class AuthEndpoints
{
  private static readonly ConcurrentDictionary<string, string> pkceStateStore = new(); // In-memory store for PKCE state and verifier

  public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
  {
    var authBuilder = app
      .MapGroup("/api/auth")
      .WithTags("Auth");

    authBuilder
      .MapGet("/web/login", TelegramWebLoginAsync)
      .WithSummary("Initiate Telegram login flow for web")
      .Produces(StatusCodes.Status302Found);

    authBuilder
      .MapGet("/web/callback", TelegramWebCallbackAsync)
      .WithSummary("Handle the Telegram login callback for web")
      .Produces(StatusCodes.Status200OK);

    authBuilder
      .MapGet("/login", TelegramMobileLoginAsync)
      .WithSummary("Initiate Telegram login flow")
      .Produces(StatusCodes.Status302Found);

    authBuilder
      .MapGet("/callback", TelegramCallbackAsync)
      .WithSummary("Handle the Telegram login callback and exchange the authorization code for an internal JWT token");

    authBuilder
      .MapPost("/refresh-token", RefreshTokenAsync)
      .WithSummary("Issue a new access token and refresh token using a valid refresh token")
      .Produces<RefreshTokenResponseDto>(StatusCodes.Status200OK);
  }

  internal static async Task<IResult> RefreshTokenAsync(
    RefreshTokenRequestDto request,
    IRefreshTokenService refreshTokenService,
    ITokenService tokenService,
    ILogger<Program> logger
  )
  {
    var newRefreshToken = await refreshTokenService.ValidateAndRotateAsync(request.RefreshToken);

    if (newRefreshToken is null)
    {
      logger.LogWarning("RefreshToken failed: token is invalid, expired, or revoked");
      return Results.Unauthorized();
    }

    var accessToken = tokenService.GenerateToken(newRefreshToken.UserId, newRefreshToken.ProviderId);

    logger.LogInformation("Rotated refresh token and issued new access token for user: {UserId}", newRefreshToken.UserId);

    return Results.Ok(new RefreshTokenResponseDto
    {
      AccessToken = accessToken,
      RefreshToken = newRefreshToken.Token
    });
  }

  internal static async Task<IResult> TelegramWebCallbackAsync(
    HttpRequest request,
    IOptions<TelegramSettings> telegramSettings,
    IOptions<AdminSettings> adminSettings,
    ITokenService tokenService,
    IRefreshTokenService refreshTokenService,
    IUserService userService,
    ILogger<Program> logger
  )
  {
    var code = request.Query["code"].ToString();
    var state = request.Query["state"].ToString();
    var settings = telegramSettings.Value;

    logger.LogInformation("Received Telegram callback with code: {Code} and state: {State}", code, state);

    if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
    {
      logger.LogError("Telegram callback failed: Missing code or state");
      return FailedRedirectToWeb(settings, "missing_code_or_state");
    }

    if (!pkceStateStore.TryRemove(state, out var verifier))
    {
      logger.LogError("Telegram callback failed: Invalid state parameter");
      return FailedRedirectToWeb(settings, "invalid_state");
    }
    logger.LogInformation("CALLBACK — state: {state}, verifier: {verifier}", state, verifier);

    // Exchange code to token
    using var httpClient = new HttpClient();
    var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{settings.ClientId}:{settings.ClientSecret}"));
    logger.LogInformation("Credentials: {credentials}", credentials);

    httpClient.DefaultRequestHeaders.Add("Authorization", $"Basic {credentials}");

    var tokenRes = await httpClient.PostAsync("https://oauth.telegram.org/token",
        new FormUrlEncodedContent(new Dictionary<string, string>
        {
                { "grant_type", "authorization_code" },
                { "code", code },
                { "redirect_uri", settings.WebCallbackRedirectUri },
                { "code_verifier", verifier }
        })
    );

    logger.LogInformation("Telegram token exchange response: {tokenResponseMessage}", tokenRes);
    if (!tokenRes.IsSuccessStatusCode)
    {
      logger.LogError("Telegram token exchange failed: {StatusCode} - {ReasonPhrase}", tokenRes.StatusCode, tokenRes.ReasonPhrase);
      return FailedRedirectToWeb(settings, "token_exchange_failed");
    }

    var raw = await tokenRes.Content.ReadAsStringAsync();
    logger.LogInformation("Raw token response: {raw}", raw);

    var tokenData = await tokenRes.Content.ReadFromJsonAsync<TelegramTokenResponse>();
    logger.LogInformation("Received Telegram token response: {tokenData}", tokenData);

    if (tokenData == null || string.IsNullOrEmpty(tokenData.IdToken))
    {
      logger.LogError("Telegram token response was invalid or missing id_token");
      return FailedRedirectToMobile(settings, "invalid_token_response");
    }

    var telegramUser = await ValidateIdToken(tokenData.IdToken, settings.ClientId);
    if (telegramUser == null)
    {
      logger.LogError("Telegram token response missing NameIdentifier claim");
      return FailedRedirectToWeb(settings, "invalid_id_token");
    }

    var userId = telegramUser.Id;
    var allowedTelegramIds = adminSettings.Value.AllowedTelegramIds ?? [];

    if (!allowedTelegramIds.Contains(userId) || string.IsNullOrEmpty(userId))
    {
      logger.LogError("Telegram user with ID {UserId} is not in the allowed list", userId);
      return FailedRedirectToWeb(settings, "access_denied");
    }

    var internalToken = tokenService.GenerateAdminToken(userId);
    var providerId = $"telegram:{userId}";


    logger.LogInformation(
        "Generated internal JWT token for user: {UserId}",
        userId
    );

    return SuccessRedirectToWeb(settings, internalToken, string.Empty, isAdmin: true);
  }

  internal static async Task<IResult> TelegramCallbackAsync(
    HttpRequest request,
    IOptions<TelegramSettings> telegramSettings,
    ITokenService tokenService,
    IRefreshTokenService refreshTokenService,
    IUserService userService,
    ILogger<Program> logger
  )
  {
    var code = request.Query["code"].ToString();
    var state = request.Query["state"].ToString();
    var settings = telegramSettings.Value;

    logger.LogInformation("Received Telegram callback with code: {Code} and state: {State}", code, state);

    if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
    {
      logger.LogError("Telegram callback failed: Missing code or state");
      return FailedRedirectToMobile(settings, "missing_code_or_state");
    }

    if (!pkceStateStore.TryRemove(state, out var verifier))
    {
      logger.LogError("Telegram callback failed: Invalid state parameter");
      return FailedRedirectToMobile(settings, "invalid_state");
    }
    logger.LogInformation("CALLBACK — state: {state}, verifier: {verifier}", state, verifier);

    // Exchange code to token
    using var httpClient = new HttpClient();
    var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{settings.ClientId}:{settings.ClientSecret}"));
    logger.LogInformation("Credentials: {credentials}", credentials);

    httpClient.DefaultRequestHeaders.Add("Authorization", $"Basic {credentials}");

    var tokenRes = await httpClient.PostAsync("https://oauth.telegram.org/token",
        new FormUrlEncodedContent(new Dictionary<string, string>
        {
                { "grant_type", "authorization_code" },
                { "code", code },
                { "redirect_uri", settings.MobileCallbackRedirectUri },
                { "code_verifier", verifier }
        })
    );

    logger.LogInformation("Telegram token exchange response: {tokenResponseMessage}", tokenRes);
    if (!tokenRes.IsSuccessStatusCode)
    {
      logger.LogError("Telegram token exchange failed: {StatusCode} - {ReasonPhrase}", tokenRes.StatusCode, tokenRes.ReasonPhrase);
      return FailedRedirectToMobile(settings, "token_exchange_failed");
    }

    var raw = await tokenRes.Content.ReadAsStringAsync();
    logger.LogInformation("Raw token response: {raw}", raw);

    var tokenData = await tokenRes.Content.ReadFromJsonAsync<TelegramTokenResponse>();
    logger.LogInformation("Received Telegram token response: {tokenData}", tokenData);

    if (tokenData == null || string.IsNullOrEmpty(tokenData.IdToken))
    {
      logger.LogError("Telegram token response was invalid or missing id_token");
      return FailedRedirectToMobile(settings, "invalid_token_response");
    }

    var telegramUser = await ValidateIdToken(tokenData.IdToken, settings.ClientId);
    if (telegramUser == null)
    {
      logger.LogError("Telegram token response missing NameIdentifier claim");
      return FailedRedirectToMobile(settings, "invalid_id_token");
    }

    var providerId = $"telegram:{telegramUser.Id}";
    var userEntity = await userService.GetUserByProviderIdAsync(providerId);

    if (userEntity == null)
    {
      logger.LogWarning(
          "User not found for ProviderId: {ProviderId}. Creating new user...",
          providerId
      );

      var name = telegramUser.Name ?? telegramUser.Username ?? $"User {telegramUser.Id}";
      var phone = telegramUser.Phone;
      var pictureUrl = telegramUser.Picture;
      userEntity = await userService.CreateAsync(name, null, providerId, phone, pictureUrl);
    }

    if (userEntity == null)
    {
      logger.LogWarning("User is null after user retrieval/creation for ProviderId: {ProviderId}", providerId);
      return FailedRedirectToMobile(settings, "user_creation_failed");
    }

    var internalToken = tokenService.GenerateToken(
        userEntity.Id,
        providerId
    );

    var refreshTokenEntity = await refreshTokenService.CreateAsync(userEntity.Id, providerId);

    logger.LogInformation(
        "Generated internal JWT token for user: {UserId}",
        userEntity.Id
    );

    return SuccessRedirectToMobile(settings, internalToken, refreshTokenEntity.Token);
  }

  private static IResult SuccessRedirectToMobile(TelegramSettings settings, string internalToken, string refreshToken)
  {
    var qs = HttpUtility.ParseQueryString(string.Empty);
    qs["internalToken"] = internalToken;
    qs["refreshToken"] = refreshToken;

    return RedirectToMobile(settings, qs);
  }

  private static IResult FailedRedirectToMobile(TelegramSettings settings, string error)
  {
    var qs = HttpUtility.ParseQueryString(string.Empty);
    qs["error"] = error;
    return RedirectToMobile(settings, qs);
  }

  private static IResult RedirectToWeb(TelegramSettings settings, System.Collections.Specialized.NameValueCollection qs)
  {
    var redirectUri = settings.WebRedirectUri;

    return Results.Redirect($"{redirectUri}?{qs}");
  }

  private static IResult SuccessRedirectToWeb(TelegramSettings settings, string internalToken, string refreshToken, bool isAdmin)
  {
    var qs = HttpUtility.ParseQueryString(string.Empty);
    qs["internalToken"] = internalToken;
    qs["refreshToken"] = refreshToken;
    qs["isAdmin"] = isAdmin.ToString();

    return RedirectToWeb(settings, qs);
  }

  private static IResult FailedRedirectToWeb(TelegramSettings settings, string error)
  {
    var qs = HttpUtility.ParseQueryString(string.Empty);
    qs["error"] = error;
    return RedirectToWeb(settings, qs);
  }

  private static IResult RedirectToMobile(TelegramSettings settings, System.Collections.Specialized.NameValueCollection qs)
  {
    var redirectUri = settings.MobileRedirectUri;

    return Results.Redirect($"{redirectUri}?{qs}");
  }

  internal static async Task<IResult> TelegramMobileLoginAsync(
    IOptions<TelegramSettings> telegramSettings,
    ILogger<Program> logger
  )
  {
    var settings = telegramSettings.Value;
    var redirectUri = settings.MobileCallbackRedirectUri;

    return await TelegramLoginAsync(telegramSettings, redirectUri, logger);
  }

  internal static async Task<IResult> TelegramWebLoginAsync(
    IOptions<TelegramSettings> telegramSettings,
    ILogger<Program> logger
  )
  {
    var settings = telegramSettings.Value;
    var redirectUri = settings.WebCallbackRedirectUri;

    return await TelegramLoginAsync(telegramSettings, redirectUri, logger);
  }

  internal static async Task<IResult> TelegramLoginAsync(
    IOptions<TelegramSettings> telegramSettings,
    string redirectUri,
    ILogger<Program> logger
  )
  {
    var settings = telegramSettings.Value;
    var state = Guid.NewGuid().ToString("N"); // Generate a random state parameter for CSRF protection
    var (verifier, challenge) = GeneratePkce();
    logger.LogInformation("LOGIN — state: {state}, verifier: {verifier}, challenge: {challenge}", state, verifier, challenge);
    pkceStateStore[state] = verifier; // Store the verifier for later use

    var qs = HttpUtility.ParseQueryString(string.Empty);

    qs["client_id"] = settings.ClientId;
    qs["redirect_uri"] = redirectUri;
    qs["response_type"] = "code";
    qs["scope"] = "openid profile phone";
    qs["state"] = state;
    qs["code_challenge"] = challenge;
    qs["code_challenge_method"] = "S256";

    return Results.Redirect($"https://oauth.telegram.org/auth?{qs}");
  }

  static async Task<TelegramUser?> ValidateIdToken(string idToken, string clientId)
  {
    using var http = new HttpClient();
    var jwks = await http.GetStringAsync("https://oauth.telegram.org/.well-known/jwks.json");

    try
    {
      var handler = new JwtSecurityTokenHandler();
      var keySet = new JsonWebKeySet(jwks);

      handler.ValidateToken(idToken, new TokenValidationParameters
      {
        ValidIssuer = "https://oauth.telegram.org",
        ValidAudience = clientId,
        IssuerSigningKeys = keySet.GetSigningKeys(),
        ValidAlgorithms = new[] { "RS256" },
        ValidateLifetime = true
      }, out var validated);

      var jwt = validated as JwtSecurityToken;
      return new TelegramUser(
          jwt.Subject,
          jwt.Claims.FirstOrDefault(c => c.Type == "name")?.Value,
          jwt.Claims.FirstOrDefault(c => c.Type == "preferred_username")?.Value,
          jwt.Claims.FirstOrDefault(c => c.Type == "phone_number")?.Value,
          jwt.Claims.FirstOrDefault(c => c.Type == "picture")?.Value
      );
    }
    catch (Exception ex)
    {
      Console.WriteLine($"ValidateIdToken failed: {ex.Message}");
      return null;
    }
  }

  record TelegramUser(
  string Id,
  string? Name,
  string? Username,
  string? Phone,
  string? Picture
);

  public class TelegramTokenResponse
  {
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = string.Empty;

    [JsonPropertyName("id_token")]
    public string IdToken { get; set; } = string.Empty;

    [JsonPropertyName("token_type")]
    public string TokenType { get; set; } = string.Empty;

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }

    [JsonPropertyName("scope")]
    public string Scope { get; set; } = string.Empty;
  }

  static (string verifier, string challenge) GeneratePkce()
  {
    var bytes = RandomNumberGenerator.GetBytes(32);

    var verifier = Convert.ToBase64String(bytes)
        .Replace("+", "-").Replace("/", "_").TrimEnd('=');

    var challengeBytes = SHA256.HashData(Encoding.ASCII.GetBytes(verifier));
    var challenge = Convert.ToBase64String(challengeBytes)
        .Replace("+", "-").Replace("/", "_").TrimEnd('=');

    return (verifier, challenge);
  }
}