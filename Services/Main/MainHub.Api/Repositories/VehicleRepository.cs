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
  Task<List<VehicleEntity>> GetAdminPagedAsync(AdminVehicleQueryDto query, int skip, int take);
  Task<long> CountAdminAsync(AdminVehicleQueryDto query);
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

  public async Task<List<VehicleEntity>> GetAdminPagedAsync(
    AdminVehicleQueryDto query,
    int skip,
    int take
  )
  {
    var filter = BuildAdminFilter(query);
    return await _vehicles
      .Find(filter)
      .SortByDescending(v => v.CreatedAt)
      .Skip(skip)
      .Limit(take)
      .ToListAsync();
  }

  public async Task<long> CountAdminAsync(AdminVehicleQueryDto query)
  {
    var filter = BuildAdminFilter(query);
    return await _vehicles.CountDocumentsAsync(filter);
  }

  private static FilterDefinition<VehicleEntity> BuildAdminFilter(AdminVehicleQueryDto query)
  {
    var builder = Builders<VehicleEntity>.Filter;
    var filters = new List<FilterDefinition<VehicleEntity>>();

    if (!string.IsNullOrWhiteSpace(query.Brand))
      filters.Add(builder.Regex(v => v.Brand, new MongoDB.Bson.BsonRegularExpression(query.Brand.Trim(), "i")));

    if (!string.IsNullOrWhiteSpace(query.Model))
      filters.Add(builder.Regex(v => v.Model, new MongoDB.Bson.BsonRegularExpression(query.Model.Trim(), "i")));

    if (!string.IsNullOrWhiteSpace(query.Vin))
      filters.Add(builder.Regex(v => v.Vin, new MongoDB.Bson.BsonRegularExpression(query.Vin.Trim(), "i")));

    if (!string.IsNullOrWhiteSpace(query.LicensePlate))
      filters.Add(builder.Regex(v => v.LicensePlate, new MongoDB.Bson.BsonRegularExpression(query.LicensePlate.Trim(), "i")));

    if (!string.IsNullOrWhiteSpace(query.Color))
      filters.Add(builder.Regex(v => v.Color, new MongoDB.Bson.BsonRegularExpression(query.Color.Trim(), "i")));

    if (query.FuelType.HasValue)
      filters.Add(builder.Eq(v => v.FuelType, query.FuelType.Value));

    if (query.TransmissionType.HasValue)
      filters.Add(builder.Eq(v => v.TransmissionType, query.TransmissionType.Value));

    if (query.WheelDriveType.HasValue)
      filters.Add(builder.Eq(v => v.WheelDriveType, query.WheelDriveType.Value));

    if (query.YearFrom.HasValue)
      filters.Add(builder.Gte(v => v.Year, query.YearFrom.Value));

    if (query.YearTo.HasValue)
      filters.Add(builder.Lte(v => v.Year, query.YearTo.Value));

    if (filters.Count == 0)
      return builder.Empty;

    return builder.And(filters);
  }
}
