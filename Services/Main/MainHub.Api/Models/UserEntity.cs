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
  }
}
