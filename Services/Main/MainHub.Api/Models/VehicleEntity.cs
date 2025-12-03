using MainHub.Api.Shared;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MainHub.Api.Models
{
  /// <summary>
  /// Represents a vehicle entity in the MainHub API.
  /// </summary>
  public class VehicleEntity
  {
    /// <summary>
    /// Gets or sets the unique identifier for the vehicle.
    /// </summary>
    [BsonId] // Marks this property as the primary key
    [BsonRepresentation(BsonType.String)]
    public required Guid Id { get; set; }

    /// <summary>
    /// Gets or sets the License Plate of the vehicle.
    /// </summary>
    [BsonElement("licensePlate")]
    public required string LicensePlate { get; set; }

    /// <summary>
    /// Gets or sets the vin number of the vehicle.
    /// </summary>
    [BsonElement("vin")]
    public required string Vin { get; set; }

    /// <summary>
    /// Gets or sets the brand of the vehicle.
    /// </summary>
    [BsonElement("brand")]
    public required string Brand { get; set; }

    /// <summary>
    /// Gets or sets the model of the vehicle.
    /// </summary>
    [BsonElement("model")]
    public required string Model { get; set; }

    /// <summary>
    /// Gets or sets the year of the vehicle.
    /// </summary>
    [BsonElement("yearCreated")]
    public required int Year { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the vehicle was bought.
    /// </summary>
    [BsonElement("boughtAt")]
    public required DateTime? BoughtAt { get; set; } = null;

    /// <summary>
    /// Gets or sets the Wheel Drive Type of the vehicle.
    /// </summary>
    [BsonElement("wheelDriveType")]
    [BsonRepresentation(BsonType.String)]
    public required WheelDriveType WheelDriveType { get; set; }

    /// <summary>
    /// Gets or sets the Engine Capacity of the vehicle.
    /// </summary>
    [BsonElement("engineCapacity")]
    public required int EngineCapacity { get; set; }

    /// <summary>
    /// Gets or sets the Fuel Type of the vehicle.
    /// </summary>
    [BsonElement("fuelType")]
    [BsonRepresentation(BsonType.String)]
    public required FuelType FuelType { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the vehicle was last modified.
    /// </summary>
    [BsonElement("updatedAt")]
    public required DateTime? UpdatedAt { get; set; } = null;

    /// <summary>
    /// Gets or sets the date and time when the vehicle was created.
    /// </summary>
    [BsonElement("createdAt")]
    public required DateTime CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets the engine power of the vehicle in horsepower.
    /// </summary>
    [BsonElement("enginePower")]
    public required int EnginePower { get; set; }

    /// <summary>
    /// Gets or sets the color of the vehicle.
    /// </summary>
    [BsonElement("color")]
    public required string Color { get; set; }

    /// <summary>
    /// Gets or sets the transmission type of the vehicle.
    /// </summary>
    [BsonElement("transmissionType")]
    [BsonRepresentation(BsonType.String)]
    public required TransmissionType TransmissionType { get; set; }

    /// <summary>
    /// Gets or sets the mileage of the vehicle.
    /// </summary>
    [BsonElement("mileage")]
    public required int Mileage { get; set; }

    /// <summary>
    /// Gets or sets the photo URL of the vehicle.
    /// </summary>
    [BsonElement("photoUrl")]
    public string? PhotoUrl { get; set; } = null;
  }
}
