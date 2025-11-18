using MainHub.Api.Services;
using MainHub.Api.DTOs;
using System.Security.Claims;

namespace MainHub.Api.Endpoints;

public static class AuthEndpoints
{
  public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
  {
    var authBuilder = app
      .MapGroup("/api/auth")
      .WithTags("Auth")
      .RequireAuthorization("RequireAzureAD"); // Only Azure AD tokens allowed
    // var _contentType = "application/json";

    authBuilder
      .MapGet("/session", CheckAuthSessionAsync)
      .Produces<CheckAuthResponseDto>(StatusCodes.Status200OK);

    authBuilder
      .MapGet("/internal-token", GetInternalTokenAsync)
      .Produces<string>(StatusCodes.Status200OK);
  }

  internal static async Task<IResult> GetInternalTokenAsync(
    ClaimsPrincipal authClaims,
    ITokenService tokenService,
    IUserService userService,
    ILogger<Program> logger
  )
  {
    var providerId = authClaims.FindFirstValue(ClaimTypes.NameIdentifier);

    logger.LogInformation(
      "GetInternalToken called by ProviderId: {ProviderId}",
      providerId
    );

    if (string.IsNullOrEmpty(providerId))
    {
      logger.LogWarning("GetInternalToken failed: ProviderId claim is missing");
      return Results.BadRequest("ProviderId claim is missing.");
    }

    var userEntity = await userService.GetUserByProviderIdAsync(providerId);
    var userId = userEntity?.Id;

    if (userId == null)
    {
      logger.LogWarning(
        "User not found for ProviderId: {ProviderId}. Cannot generate internal token.",
        providerId
      );
      return Results.BadRequest("User not found.");
    }

    var internalToken = tokenService.GenerateToken(userId.Value, providerId);

    logger.LogInformation("Generated internal JWT token for user: {UserId}", userId);
    return Results.Ok(internalToken);
  }

  internal static async Task<IResult> CheckAuthSessionAsync(
    ClaimsPrincipal authClaims,
    IUserService userService,
    ITokenService tokenService,
    ILogger<Program> logger
  )
  {
    var providerId = authClaims.FindFirstValue(ClaimTypes.NameIdentifier);
    var email = authClaims.FindFirst("preferred_authname")?.Value ?? authClaims.FindFirst("preferred_username")?.Value ?? "";
    var name = authClaims.FindFirst("name")?.Value ?? "";
    logger.LogInformation(
      "CheckAuthSession called by user: {Name}, Email: {Email}, ProviderId: {ProviderId}",
      name, email, providerId
    );

    if (string.IsNullOrEmpty(providerId))
    {
      logger.LogWarning("CheckAuthSession failed: ProviderId claim is missing");
      return Results.BadRequest("ProviderId claim is missing.");
    }

    var userEntity = await userService.GetUserByProviderIdAsync(providerId);

    if (userEntity == null)
    {
      logger.LogWarning(
        "User not found for ProviderId: {ProviderId}. Creating new user...",
        providerId
      );

      userEntity = await userService.CreateAsync(name, email, providerId);
    }

    if (userEntity == null)
    {
      logger.LogWarning("User is null after user retrieval/creation for ProviderId: {ProviderId}", providerId);
      return Results.BadRequest("Unable to retrieve or create user.");
    }

    var internalToken = tokenService.GenerateToken(
      userEntity.Id,
      providerId
    );

    var meData = (GetMeDto)userEntity;

    var response = new CheckAuthResponseDto
    {
      InternalToken = internalToken,
      MeData = meData
    };

    logger.LogInformation(
      "Generated internal JWT token for user: {UserId}",
      userEntity.Id
    );
    return Results.Ok(response);
  }
}
