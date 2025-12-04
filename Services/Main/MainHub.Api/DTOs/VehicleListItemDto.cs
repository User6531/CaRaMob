namespace MainHub.Api.DTOs
{
  /// <summary>
  /// Represents a vehicle list item DTO
  /// </summary>
  public class VehicleListItemDto
  {
    /// <summary>
    /// The unique identifier for the vehicle.
    /// </summary>
    public required Guid Id { get; set; }

    /// <summary>
    /// License Plate of the vehicle.
    /// </summary>
    public required string LicensePlate { get; set; }

    /// <summary>
    /// Brand of the vehicle.
    /// </summary>
    public required string Brand { get; set; }

    /// <summary>
    /// Model of the vehicle.
    /// </summary>
    public required string Model { get; set; }

    /// <summary>
    /// The year when the Year of the vehicle.
    /// </summary>
    public required int Year { get; set; }

    /// <summary>
    /// The photo URL of the vehicle.
    /// </summary>
    public string? PhotoUrl { get; set; } = null;
  }
}
