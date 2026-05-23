using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MainHub.Api.Models;

public class RefreshTokenEntity
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public required Guid Id { get; set; }

    [BsonElement("token")]
    public required string Token { get; set; }

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.String)]
    public required Guid UserId { get; set; }

    [BsonElement("providerId")]
    public required string ProviderId { get; set; }

    [BsonElement("expiresAt")]
    public required DateTime ExpiresAt { get; set; }

    [BsonElement("createdAt")]
    public required DateTime CreatedAt { get; set; }

    [BsonElement("isRevoked")]
    public bool IsRevoked { get; set; } = false;
}
