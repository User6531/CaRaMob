namespace MainHub.Api.Models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

/// <summary>
/// Represents a service history record.
/// </summary>
public class ServiceHistoryRecordModel
{
  /// <summary>
  /// Gets or sets the unique identifier for the service history record.
  /// </summary>
  [BsonId]
  [BsonRepresentation(BsonType.String)]
  public required Guid Id { get; set; }

  /// <summary>
  /// Gets or sets the title of the service history record.
  /// </summary>
  [BsonElement("Title")]
  public required string Title { get; set; }

  /// <summary>
  /// Gets or sets the description of the service history record.
  /// </summary>
  [BsonElement("Description")]
  public required string Description { get; set; }

  /// <summary>
  /// Gets or sets the price of the service history record.
  /// </summary>
  [BsonElement("Price")]
  public required int Price { get; set; }
}
