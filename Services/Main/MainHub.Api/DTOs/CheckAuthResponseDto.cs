namespace MainHub.Api.DTOs
{
  /// <summary>
  /// Represent a check authentication response DTO.
  /// </summary>
  public class CheckAuthResponseDto
  {
    /// <summary>
    /// The internal authentication token.
    /// </summary>
    public required string InternalToken { get; set; }

    /// <summary>
    /// The user's information.
    /// </summary>
    public required GetMeDto MeData { get; set; }
  }
}
