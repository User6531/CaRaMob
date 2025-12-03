namespace MainHub.Api.DTOs
{
  /// <summary>
  /// Represents a vehicle DTO
  /// </summary>
  public class VehicleDto
  {
    /// <summary>
    /// Vin number of the vehicle.
    /// </summary>
    public required string Vin { get; set; }
  }
}
