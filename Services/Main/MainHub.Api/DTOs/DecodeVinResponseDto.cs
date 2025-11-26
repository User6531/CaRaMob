namespace MainHub.Api.DTOs
{
  /// <summary>
  /// Represent a check authentication response DTO.
  /// </summary>
  public class DecodeVinResponseDto
  {
    /// <summary>
    /// The Vehicle model.
    /// </summary>
    public required string Model { get; set; }

    /// <summary>
    /// The Vehicle brand.
    /// </summary>
    public required string Brand { get; set; }

    /// <summary>
    /// The Vehicle year.
    /// </summary>
    public required short Year { get; set; }
  }
}
