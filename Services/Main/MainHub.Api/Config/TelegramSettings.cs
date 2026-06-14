namespace MainHub.Api.Config;

/// <summary>
/// Configuration settings for Telegram authentication.
/// </summary>
public class TelegramSettings
{
    /// <summary>
    /// Gets or sets the Telegram client ID for authentication.
    /// </summary>
    public required string ClientId { get; set; }

    /// <summary>
    /// Gets or sets the Telegram client secret for authentication.
    /// </summary>
    public required string ClientSecret { get; set; }

    /// <summary>
    /// Gets or sets the mobile callback redirect URI for Telegram authentication.
    /// </summary>
    public required string MobileCallbackRedirectUri { get; set; }

    /// <summary>
    /// Gets or sets the web callback redirect URI for Telegram authentication.
    /// </summary>
    public required string WebCallbackRedirectUri { get; set; }

    /// <summary>
    /// Deep link URI for redirecting back to the mobile app after successful login.
    /// </summary>
    public required string MobileRedirectUri { get; set; }

    /// <summary>
    /// URI for redirecting back to the web client after successful login.
    /// </summary>
    public required string WebRedirectUri { get; set; }
}
