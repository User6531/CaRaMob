using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MainHub.Api.Models
{
  /// <summary>
  /// Represents a user entity in the MainHub API.
  /// </summary>
  public class UserEntity
  {
    /// <summary>
    /// Gets or sets the unique identifier for the user.
    /// </summary>
    [BsonId] // Marks this property as the primary key
    [BsonRepresentation(BsonType.String)]
    public required Guid Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the user.
    /// </summary>
    [BsonElement("name")]
    public required string Name { get; set; }

    /// <summary>
    /// Gets or sets the email address of the user.
    /// </summary>
    [BsonElement("email")]
    public string? Email { get; set; }

    /// <summary>
    /// Gets or sets the provider identifier for the user.
    /// </summary>
    [BsonElement("providerId")]
    public required string ProviderId { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the user was created.
    /// </summary>
    [BsonElement("createdAt")]
    public required DateTime CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the user was last modified.
    /// Can be null if the user has not been modified.
    /// </summary>
    [BsonElement("updatedAt")]
    public required DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// Gets or sets users's associated vehicles.
    /// </summary>
    [BsonElement("vehicleIds")]
    public required List<Guid> VehicleIds { get; set; } = [];

    /// <summary>
    /// Gets or sets the phone number of the user.
    /// </summary>
    [BsonElement("phone")]
    public required string? Phone { get; set; }

    /// <summary>
    /// Gets or sets the URL of the user's profile picture.
    /// </summary>
    [BsonElement("pictureUrl")]
    public required string? PictureUrl { get; set; }
   }
}
