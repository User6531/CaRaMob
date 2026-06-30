using MongoDB.Driver;
using Microsoft.Extensions.Options;
using MainHub.Api.Models;
using MainHub.Api.Config;
using MainHub.Api.DTOs;

namespace MainHub.Api.Repositories;

/// <summary>
/// Defines methods for managing vehicle entities in the data store.
/// </summary>
public interface IVehicleRepository
{
  /// <summary>
  /// Creates a new vehicle entity asynchronously.
  /// </summary>
  /// <param name="vehicle">The vehicle entity to create.</param>
  /// <returns>A task that represents the asynchronous operation.</returns>
  Task CreateAsync(VehicleEntity vehicle);

  /// <summary>
  /// Retrieves a vehicle entities by its unique identifier asynchronously.
  /// </summary>
  /// <param name="ids">The List of unique identifiers of the vehicles.</param>
  Task<List<VehicleEntity>> GetByIdsAsync(List<Guid> ids);

  /// <summary>
  /// Retrieves vehicle entities by ID asynchronously.
  /// </summary>
  /// <param name="id">The unique identifier of the vehicle.</param>
  Task<VehicleEntity> GetByIdAsync(Guid userId);

  /// <summary>
  /// Deletes a vehicle entity by its unique identifier asynchronously.
  /// </summary>
  /// <param name="vehicleId">The unique identifier of the vehicle to delete.</param>
  Task DeleteAsync(Guid vehicleId);

  /// <summary>
  /// Updates a vehicle entity asynchronously.
  /// </summary>
  /// <param name="filter">The filter to locate the vehicle to update.</param>
  /// <param name="update">The update definition containing the fields to update.</param>
  /// <returns>A task that represents the asynchronous operation. The task result contains the update result.</returns>
  Task<UpdateResult> UpdateOneAsync(
    FilterDefinition<VehicleEntity> filter,
    UpdateDefinition<VehicleEntity> update
  );

  /// <summary>
  /// Retrieves a paged list of vehicle entities for admin users asynchronously.
  /// </summary>
  /// <param name="skip"></param>
  /// <param name="limit"></param>
  /// <returns></returns>
  Task<List<VehicleEntity>> GetAllVehiclesAsync(int skip, int limit);

  /// <summary>
  /// Retrieves the total count of vehicle entities for admin users asynchronously.
  /// </summary>
  /// <returns></returns>
  Task<long> GetCountAsync();
}

public class VehicleRepository : IVehicleRepository
{
  private readonly IMongoCollection<VehicleEntity> _vehicles;

  public VehicleRepository(IMongoClient client, IOptions<MongoDbSettings> settings)
  {
    var database = client.GetDatabase(settings.Value.DatabaseName);
    _vehicles = database.GetCollection<VehicleEntity>(settings.Value.VehicleCollectionName);
  }

  public async Task<VehicleEntity> GetByIdAsync(Guid id)
  {
    var filter = Builders<VehicleEntity>.Filter.Eq(v => v.Id, id);
    return await _vehicles.Find(filter).FirstOrDefaultAsync();
  }

  public async Task<UpdateResult> UpdateOneAsync(
    FilterDefinition<VehicleEntity> filter,
    UpdateDefinition<VehicleEntity> update
  )
  {
    return await _vehicles.UpdateOneAsync(filter, update);
  }

  public async Task<List<VehicleEntity>> GetByIdsAsync(List<Guid> ids)
  {
    var filter = Builders<VehicleEntity>.Filter.In(v => v.Id, ids);
    return await _vehicles.Find(filter).ToListAsync();
  }

  public async Task CreateAsync(VehicleEntity vehicle)
  {
    await _vehicles.InsertOneAsync(vehicle);
  }

  public async Task DeleteAsync(Guid vehicleId)
  {
    var filter = Builders<VehicleEntity>.Filter.Eq(v => v.Id, vehicleId);
    await _vehicles.DeleteOneAsync(filter);
  }

  public async Task<List<VehicleEntity>> GetAllVehiclesAsync(
    int skip,
    int limit
  )
  {
    var builder = Builders<VehicleEntity>.Filter;
    var filter = builder.Empty;

    return await _vehicles
      .Find(filter)
      .SortByDescending(v => v.CreatedAt)
      .Skip(skip)
      .Limit(limit)
      .ToListAsync();
  }

  public async Task<long> GetCountAsync()
  {
    var builder = Builders<VehicleEntity>.Filter;
    var filter = builder.Empty;

    return await _vehicles.CountDocumentsAsync(filter);
  }
}
