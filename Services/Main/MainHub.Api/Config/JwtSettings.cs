namespace MainHub.Api.Config;

/// <summary>
/// Configuration settings for JWT token generation and validation.
/// </summary>
public class JwtSettings
{
    /// <summary>
    /// Gets or sets the secret key used to sign JWT tokens.
    /// Should be a long, random string (at least 32 characters).
    /// </summary>
    public required string SecretKey { get; set; }

    /// <summary>
    /// Gets or sets the issuer of the JWT token.
    /// </summary>
    public required string Issuer { get; set; }

    /// <summary>
    /// Gets or sets the audience of the JWT token.
    /// </summary>
    public required string Audience { get; set; }

    /// <summary>
    /// Gets or sets the expiration time in minutes.
    /// </summary>
    public int ExpirationMinutes { get; set; } = 60;

    /// <summary>
    /// Gets or sets the refresh token expiration time in days.
    /// </summary>
    public int RefreshTokenExpirationDays { get; set; } = 30;
}

