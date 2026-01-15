using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MainHub.Api.Models
{
    /// <summary>
    /// Represents a service history entry for a vehicle in the MainHub API.
    /// </summary>
    public class ServiceHistoryEntity
    {
        /// <summary>
        /// Gets or sets the unique identifier for the service history record.
        /// </summary>
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public required string Id { get; set; }

        /// <summary>
        /// Gets or sets the unique identifier of the vehicle associated with this service record.
        /// </summary>
        [BsonElement("vehicleId")]
        public required string VehicleId { get; set; }

        /// <summary>
        /// Gets or sets the title or name of the service performed.
        /// </summary>
        [BsonElement("title")]
        public required string Title { get; set; }

        /// <summary>
        /// Gets or sets the detailed description of the service performed.
        /// </summary>
        [BsonElement("description")]
        public string? Description { get; set; }

        /// <summary>
        /// Gets or sets the cost of the service.
        /// </summary>
        [BsonElement("price")]
        public required decimal Price { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the service record was created.
        /// </summary>
        [BsonElement("createdDate")]
        public required DateTime CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the service record was last updated.
        /// </summary>
        [BsonElement("updatedDate")]
        public required DateTime UpdatedDate { get; set; }
    }
}


