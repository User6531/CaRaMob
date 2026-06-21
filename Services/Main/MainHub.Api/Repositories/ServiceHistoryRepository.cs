using MongoDB.Driver;
using Microsoft.Extensions.Options;
using MainHub.Api.Models;
using MainHub.Api.Config;

namespace MainHub.Api.Repositories;

/// <summary>
/// Defines methods for managing service history entities in the data store.
/// </summary>
public interface IServiceHistoryRepository
{
  /// <summary>
  /// Retrieves service history entities by vehicle ID asynchronously.
  /// </summary>
  /// <param name="vehicleId">The unique identifier of the vehicle.</param>
  Task<List<ServiceHistoryEntity>> GetAllByVehicleIdAsync(Guid vehicleId);

  /// <summary>
  /// Deletes a service history entity by its unique identifier asynchronously.
  /// </summary>
  /// <param name="serviceHistoryId">The unique identifier of the service history record to delete.</param>
  /// <returns>A task that represents the asynchronous operation. The task result indicates whether the deletion was successful.</returns>
  Task<bool> DeleteAsync(Guid serviceHistoryId);

  /// <summary>
  /// Deletes all service history records associated with a vehicle asynchronously.
  /// </summary>
  /// <param name="vehicleId">The unique identifier of the vehicle.</param>
  /// <returns>A task that represents the asynchronous operation.</returns>
  Task DeleteAllByVehicleIdAsync(Guid vehicleId);

  /// <summary>
  /// Retrieves a service history record by its unique identifier asynchronously.
  /// </summary>
  /// <param name="vehicleId">The unique identifier of the vehicle.</param>
  /// <param name="serviceHistoryId">The unique identifier of the service history record.</param>
  /// <returns>A task that represents the asynchronous operation. The task result contains the service history details.</returns>
  Task<ServiceHistoryEntity> GetByIdAsync(Guid vehicleId, Guid serviceHistoryId);
  Task<ServiceHistoryEntity?> GetByServiceHistoryIdAsync(Guid serviceHistoryId);

  /// <summary>
  /// Creates a new service history record for a vehicle asynchronously.
  /// </summary>
  /// <param name="serviceHistory">The service history entity to create.</param>
  /// <returns>A task that represents the asynchronous operation.</returns>
  Task CreateAsync(ServiceHistoryEntity serviceHistory);

  /// <summary>
  /// Updates a service history record for a vehicle asynchronously.
  /// </summary>
  /// <param name="serviceHistory">The service history entity to update.</param>
  /// <returns>A task that represents the asynchronous operation. The task result indicates whether the update was successful.</returns>
  Task<bool> UpdateAsync(ServiceHistoryEntity serviceHistory);
}

public class ServiceHistoryRepository : IServiceHistoryRepository
{
  private readonly IMongoCollection<ServiceHistoryEntity> _serviceHistories;

  public ServiceHistoryRepository(IMongoClient client, IOptions<MongoDbSettings> settings)
  {
    var database = client.GetDatabase(settings.Value.DatabaseName);
    _serviceHistories = database.GetCollection<ServiceHistoryEntity>(settings.Value.ServiceHistoryCollectionName);
  }

  public async Task<bool> UpdateAsync(ServiceHistoryEntity serviceHistory)
  {
    var filter = Builders<ServiceHistoryEntity>.Filter.Eq(sh => sh.Id, serviceHistory.Id);
    var result = await _serviceHistories.ReplaceOneAsync(filter, serviceHistory);
    return result.ModifiedCount > 0;
  }

  public async Task CreateAsync(ServiceHistoryEntity serviceHistory)
  {
    await _serviceHistories.InsertOneAsync(serviceHistory);
  }

  public async Task<ServiceHistoryEntity> GetByIdAsync(Guid vehicleId, Guid serviceHistoryId)
  {
    var filter = Builders<ServiceHistoryEntity>.Filter.And(
      Builders<ServiceHistoryEntity>.Filter.Eq(sh => sh.VehicleId, vehicleId),
      Builders<ServiceHistoryEntity>.Filter.Eq(sh => sh.Id, serviceHistoryId)
    );

    return await _serviceHistories.Find(filter).FirstOrDefaultAsync();
  }

  public async Task<ServiceHistoryEntity?> GetByServiceHistoryIdAsync(Guid serviceHistoryId)
  {
    var filter = Builders<ServiceHistoryEntity>.Filter.Eq(sh => sh.Id, serviceHistoryId);
    return await _serviceHistories.Find(filter).FirstOrDefaultAsync();
  }

  public async Task<bool> DeleteAsync(Guid serviceHistoryId)
  {
    var filter = Builders<ServiceHistoryEntity>.Filter.Eq(sh => sh.Id, serviceHistoryId);
    var result = await _serviceHistories.DeleteOneAsync(filter);
    return result.DeletedCount > 0;
  }

  public async Task DeleteAllByVehicleIdAsync(Guid vehicleId)
  {
    var filter = Builders<ServiceHistoryEntity>.Filter.Eq(sh => sh.VehicleId, vehicleId);
    await _serviceHistories.DeleteManyAsync(filter);
  }

  public async Task<List<ServiceHistoryEntity>> GetAllByVehicleIdAsync(Guid vehicleId)
  {
    var filter = Builders<ServiceHistoryEntity>.Filter.Eq(sh => sh.VehicleId, vehicleId);
    return await _serviceHistories.Find(filter).ToListAsync();
  }
}
