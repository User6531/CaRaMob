using MongoDB.Driver;
using Microsoft.Extensions.Options;
using MainHub.Api.Models;
using MainHub.Api.Config;

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
  /// Checks if a VIN already exists in the database asynchronously.
  /// </summary>
  /// <param name="vin">The VIN to check for duplicates.</param>
  /// <returns>True if a duplicate VIN exists, false otherwise.</returns>
  Task<bool> VinExistsAsync(string vin);
}

public class VehicleRepository : IVehicleRepository
{
  private readonly IMongoCollection<VehicleEntity> _vehicles;

  public VehicleRepository(IMongoClient client, IOptions<MongoDbSettings> settings)
  {
    var database = client.GetDatabase(settings.Value.DatabaseName);
    _vehicles = database.GetCollection<VehicleEntity>(settings.Value.VehicleCollectionName);
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

  public async Task<bool> VinExistsAsync(string vin)
  {
    var filter = Builders<VehicleEntity>.Filter.Eq(v => v.Vin, vin);
    var existingVehicle = await _vehicles.Find(filter).FirstOrDefaultAsync();
    return existingVehicle != null;
  }
}
