using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MainHub.Api.Models;

/// <summary>
/// Represents a user entity in the MainHub API.
/// </summary>
public class ServiceHistoryEntity
{
  /// <summary>
  /// Gets or sets the unique identifier for the service history entity.
  /// </summary>
  [BsonId] // Marks this property as the primary key
  [BsonRepresentation(BsonType.String)]
  public required Guid Id { get; set; }

  /// <summary>
  /// Gets or sets the unique identifier of the vehicle associated with the service history entity.
  /// </summary>
  [BsonElement("vehicleId")]
  [BsonRepresentation(BsonType.String)]
  public required Guid VehicleId { get; set; }

  /// <summary>
  /// Gets or sets the name of the user.
  /// </summary>
  [BsonElement("title")]
  public required string Title { get; set; }

  /// <summary>
  /// Gets or sets the date and time when the service history entity was created.
  /// </summary>
  [BsonElement("createdAt")]
  public required DateTime CreatedAt { get; set; }

  /// <summary>
  /// Gets or sets the date and time when the service history entity was last modified.
  /// Can be null if the service history entity has not been modified.
  /// </summary>
  [BsonElement("updatedAt")]
  public required DateTime? UpdatedAt { get; set; }

  /// <summary>
  /// Gets or sets the description of the service history.
  /// </summary>
  [BsonElement("Description")]
  public required string Description { get; set; }

  /// <summary>
  /// Gets or sets service history records associated with the service history entity.
  /// </summary>
  [BsonElement("records")]
  public required List<ServiceHistoryRecordModel> Records { get; set; } = [];
}
