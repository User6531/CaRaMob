using MainHub.Api.Config;
using MainHub.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace MainHub.Api.Repositories
{
    /// <summary>
    /// Defines methods for managing service history records in the data store.
    /// </summary>
    public interface IServiceHistoryRepository
    {
        /// <summary>
        /// Creates a new service history record asynchronously.
        /// </summary>
        /// <param name="entity">The service history entity to create.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task CreateAsync(ServiceHistoryEntity entity);

        /// <summary>
        /// Retrieves service history records for a specific vehicle with pagination.
        /// </summary>
        /// <param name="vehicleId">The unique identifier of the vehicle.</param>
        /// <param name="page">The page number to retrieve (starting from 1).</param>
        /// <param name="pageSize">The number of records per page.</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains a list of <see cref="ServiceHistoryEntity"/> records.
        /// </returns>
        Task<List<ServiceHistoryEntity>> GetByVehicleIdAsync(
            Guid vehicleId,
            int page,
            int pageSize
        );
    }

    /// <summary>
    /// Provides MongoDB-based implementation for managing service history records.
    /// </summary>
    public class ServiceHistoryRepository : IServiceHistoryRepository
    {
        private readonly IMongoCollection<ServiceHistoryEntity> _collection;

        /// <summary>
        /// Initializes a new instance of the <see cref="ServiceHistoryRepository"/> class.
        /// </summary>
        /// <param name="client">The MongoDB client instance.</param>
        /// <param name="settings">The MongoDB configuration settings.</param>
        public ServiceHistoryRepository(
            IMongoClient client,
            IOptions<MongoDbSettings> settings
        )
        {
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _collection = database.GetCollection<ServiceHistoryEntity>(
                settings.Value.ServiceHistoryCollectionName
            );

            CreateIndexes();
        }

        /// <summary>
        /// Creates required MongoDB indexes for the service history collection.
        /// </summary>
        /// <remarks>
        /// The compound index on <c>VehicleId</c> and <c>CreatedDate</c> improves
        /// query performance when retrieving service records by vehicle
        /// and sorting them by creation date.
        /// </remarks>
        private void CreateIndexes()
        {
            var indexKeys = Builders<ServiceHistoryEntity>.IndexKeys
                .Ascending(x => x.VehicleId)
                .Descending(x => x.CreatedDate);

            var indexModel = new CreateIndexModel<ServiceHistoryEntity>(indexKeys);
            _collection.Indexes.CreateOne(indexModel);
        }

        /// <summary>
        /// Creates a new service history record asynchronously.
        /// </summary>
        /// <param name="entity">The service history entity to create.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task CreateAsync(ServiceHistoryEntity entity)
        {
            await _collection.InsertOneAsync(entity);
        }

        /// <summary>
        /// Retrieves service history records for a specific vehicle with pagination.
        /// </summary>
        /// <param name="vehicleId">The unique identifier of the vehicle.</param>
        /// <param name="page">The page number to retrieve (starting from 1).</param>
        /// <param name="pageSize">The number of records per page.</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains a list of <see cref="ServiceHistoryEntity"/> records.
        /// </returns>
        public async Task<List<ServiceHistoryEntity>> GetByVehicleIdAsync(
            Guid vehicleId,
            int page,
            int pageSize
        )
        {
            {
                return await _collection
                    .Find(x => x.VehicleId == vehicleId)
                    .SortByDescending(x => x.CreatedDate)
                    .Skip((page - 1) * pageSize)
                    .Limit(pageSize)
                    .ToListAsync();
            }
        }
    }
}