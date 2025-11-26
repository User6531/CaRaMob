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
  }
}
