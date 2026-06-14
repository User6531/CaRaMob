namespace MainHub.Api.Config;

/// <summary>
/// Configuration settings for admin authentication
/// </summary>
public class AdminSettings
{
  public required List<string> AllowedTelegramIds { get; set; }
}

