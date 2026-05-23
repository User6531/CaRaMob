namespace MainHub.Api.DTOs
{
  /// <summary>
  /// Represent a check authentication response DTO.
  /// </summary>
  public class CheckAuthResponseDto
  {
    /// <summary>
    /// The short-lived internal JWT access token.
    /// </summary>
    public required string InternalToken { get; set; }

    /// <summary>
    /// The long-lived refresh token used to obtain a new access token without re-authentication.
    /// </summary>
    public required string RefreshToken { get; set; }

    /// <summary>
    /// The user's information.
    /// </summary>
    public required GetMeDto MeData { get; set; }
  }
}
