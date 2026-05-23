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
    /// Gets or sets the redirect URI for Telegram authentication callbacks.
    /// </summary>
    public required string RedirectUri { get; set; }
}
