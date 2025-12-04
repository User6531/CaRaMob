namespace MainHub.Api.DTOs
{
  /// <summary>
  /// Represents a vehicle DTO for updating a vehicle.
  /// </summary>
  public class UpdateVehicleDto
  {
    /// <summary>
    /// License Plate of the vehicle.
    /// </summary>
    public required string? LicensePlate { get; set; }

    /// <summary>
    /// The date and time when the vehicle was bought.
    /// </summary>
    public required DateTime? BoughtAt { get; set; } = null;

    /// <summary>
    /// The color of the vehicle.
    /// </summary>
    public required string? Color { get; set; }

    /// <summary>
    /// The mileage of the vehicle.
    /// </summary>
    public required int? Mileage { get; set; }

    /// <summary>
    /// The photo URL of the vehicle.
    /// </summary>
    public string? PhotoUrl { get; set; } = null;
  }
}
