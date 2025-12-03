using MainHub.Api.Shared;

namespace MainHub.Api.DTOs
{
  /// <summary>
  /// Represents a vehicle DTO for creating a new vehicle.
  /// </summary>
  public class CreateVehicleDto
  {
    /// <summary>
    /// License Plate of the vehicle.
    /// </summary>
    public required string LicensePlate { get; set; }

    /// <summary>
    /// Vin number of the vehicle.
    /// </summary>
    public required string Vin { get; set; }

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
    /// The date and time when the vehicle was bought.
    /// </summary>
    public required DateTime? BoughtAt { get; set; } = null;

    /// <summary>
    /// The Wheel Drive Type of the vehicle.
    /// </summary>
    public required WheelDriveType WheelDriveType { get; set; }

    /// <summary>
    /// The Engine Capacity of the vehicle.
    /// </summary>
    public required int EngineCapacity { get; set; }

    /// <summary>
    /// The Fuel Type of the vehicle.
    /// </summary>
    public required FuelType FuelType { get; set; }

    /// <summary>
    /// The engine power of the vehicle in horsepower.
    /// </summary>
    public required int EnginePower { get; set; }

    /// <summary>
    /// The color of the vehicle.
    /// </summary>
    public required string Color { get; set; }

    /// <summary>
    /// The transmission type of the vehicle.
    /// </summary>
    public required TransmissionType TransmissionType { get; set; }

    /// <summary>
    /// The mileage of the vehicle.
    /// </summary>
    public required int Mileage { get; set; }

    /// <summary>
    /// The photo URL of the vehicle.
    /// </summary>
    public string? PhotoUrl { get; set; } = null;
  }
}
