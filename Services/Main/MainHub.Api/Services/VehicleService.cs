using MainHub.Api.Repositories;
using MainHub.Api.DTOs;
using MainHub.Api.Models;
using MainHub.Api.Shared;
using MongoDB.Driver;

namespace MainHub.Api.Services;

/// <summary>
/// Defines methods for managing vehicle entities.
/// </summary>
public interface IVehicleService
{
  /// <summary>
  /// Retrieves a vehicle by its unique identifier asynchronously.
  /// </summary>
  /// <param name="vehicleId">The unique identifier of the vehicle.</param>
  /// <param name="userId">The unique identifier of the user.</param>
  /// <returns>The vehicle DTO.</returns>
  Task<VehicleDto> GetVehicleByIdAsync(Guid vehicleId, Guid userId);

  /// <summary>
  /// Retrieves a vehicle by its unique identifier asynchronously.
  /// </summary>
  /// <param name="vehicleId">The unique identifier of the vehicle.</param>
  /// <param name="userId">The unique identifier of the user.</param>
  /// <returns>The vehicle DTO.</returns>
  Task<VehicleDto> GetVehicleByIdAsync(Guid vehicleId);

  /// <summary>
  /// Updates an existing vehicle asynchronously.
  /// </summary>
  /// <param name="updateVehicleDto">The vehicle DTO containing updated information.</param>
  Task UpdateAsync(Guid vehicleId, UpdateVehicleDto updateVehicleDto, Guid userId);

  /// <summary>
  /// Creates a new vehicle asynchronously.
  /// </summary>
  Task CreateAsync(CreateVehicleDto createVehicleDto, Guid userId);

  /// <summary>
  /// Retrieves all vehicles associated with a user asynchronously.
  /// </summary>
  /// <param name="userId">The unique identifier of the user.</param>
  Task<List<VehicleListItemDto>> GetAllByUserAsync(Guid userId);

  /// <summary>
  /// Deletes a vehicle associated with a user asynchronously.
  /// </summary>
  /// <param name="vehicleId">The unique identifier of the vehicle to delete.</param
  /// <param name="userId">The unique identifier of the user.</param>
  Task DeleteAsync(Guid vehicleId, Guid userId);

  /// <summary>
  /// Retrieves a paged list of all vehicles for admin users asynchronously.
  /// </summary>
  /// <param name="page"></param>
  /// <param name="pageSize"></param>
  /// <returns></returns>
  Task<PagedResultDto<AdminVehicleListItemDto>> GetAllVehiclesAsync(int page, int pageSize);
}

public class VehicleService(
  IVehicleRepository repository,
  IUserService userService,
  IServiceHistoryService serviceHistoryService
) : IVehicleService
{
  private readonly IVehicleRepository _repository = repository;
  private readonly IUserService _userService = userService;
  private readonly IServiceHistoryService _serviceHistoryService = serviceHistoryService;

  public async Task<VehicleDto> GetVehicleByIdAsync(Guid vehicleId, Guid userId)
  {
    var isVehicleBelongsToUser = await CheckIsVehicleBelongsToUser(userId, vehicleId);
    if (!isVehicleBelongsToUser)
    {
      throw new UnauthorizedAccessException("You don't have permission to access this vehicle.");
    }

    var vehicle = await _repository.GetByIdAsync(vehicleId);
    if (vehicle == null)
    {
      throw new ArgumentException($"Vehicle with ID {vehicleId} not found.");
    }

    return new VehicleDto
    {
      Id = vehicle.Id,
      Vin = vehicle.Vin,
      Brand = vehicle.Brand,
      Model = vehicle.Model,
      Year = vehicle.Year,
      Color = vehicle.Color,
      LicensePlate = vehicle.LicensePlate,
      BoughtAt = vehicle.BoughtAt,
      EngineCapacity = vehicle.EngineCapacity,
      EnginePower = vehicle.EnginePower,
      FuelType = vehicle.FuelType,
      TransmissionType = vehicle.TransmissionType,
      WheelDriveType = vehicle.WheelDriveType,
      Mileage = vehicle.Mileage,
      PhotoUrl = vehicle.PhotoUrl,
      CreatedAt = vehicle.CreatedAt,
      UpdatedAt = vehicle.UpdatedAt,
    };
  }

  public async Task<VehicleDto> GetVehicleByIdAsync(Guid vehicleId)
  {
    var vehicle = await _repository.GetByIdAsync(vehicleId);
    if (vehicle == null)
    {
      throw new ArgumentException($"Vehicle with ID {vehicleId} not found.");
    }

    return new VehicleDto
    {
      Id = vehicle.Id,
      Vin = vehicle.Vin,
      Brand = vehicle.Brand,
      Model = vehicle.Model,
      Year = vehicle.Year,
      Color = vehicle.Color,
      LicensePlate = vehicle.LicensePlate,
      BoughtAt = vehicle.BoughtAt,
      EngineCapacity = vehicle.EngineCapacity,
      EnginePower = vehicle.EnginePower,
      FuelType = vehicle.FuelType,
      TransmissionType = vehicle.TransmissionType,
      WheelDriveType = vehicle.WheelDriveType,
      Mileage = vehicle.Mileage,
      PhotoUrl = vehicle.PhotoUrl,
      CreatedAt = vehicle.CreatedAt,
      UpdatedAt = vehicle.UpdatedAt,
    };
  }

  public async Task UpdateAsync(Guid vehicleId, UpdateVehicleDto updateVehicleDto, Guid userId)
  {
    var isVehicleBelongsToUser = await CheckIsVehicleBelongsToUser(userId, vehicleId);
    if (!isVehicleBelongsToUser)
    {
      throw new UnauthorizedAccessException("You don't have permission to update this vehicle.");
    }

    var updates = new List<UpdateDefinition<VehicleEntity>>();

    if (updateVehicleDto.LicensePlate != null)
    {
      updates.Add(Builders<VehicleEntity>.Update.Set(v => v.LicensePlate, updateVehicleDto.LicensePlate));
    }

    if (updateVehicleDto.BoughtAt != null)
    {
      updates.Add(Builders<VehicleEntity>.Update.Set(v => v.BoughtAt, updateVehicleDto.BoughtAt));
    }

    if (updateVehicleDto.Color != null)
    {
      updates.Add(Builders<VehicleEntity>.Update.Set(v => v.Color, updateVehicleDto.Color));
    }

    if (updateVehicleDto.Mileage != null)
    {
      updates.Add(Builders<VehicleEntity>.Update.Set(v => v.Mileage, updateVehicleDto.Mileage));
    }

    if (updateVehicleDto.PhotoUrl != null)
    {
      updates.Add(Builders<VehicleEntity>.Update.Set(v => v.PhotoUrl, updateVehicleDto.PhotoUrl));
    }

    if (updates.Count == 0)
    {
      return; // Nothing to update
    }

    updates.Add(Builders<VehicleEntity>.Update.Set(v => v.UpdatedAt, DateTime.UtcNow));

    var combinedUpdate = Builders<VehicleEntity>.Update.Combine(updates);
    var filter = Builders<VehicleEntity>.Filter.Eq(v => v.Id, vehicleId);

    var result = await _repository.UpdateOneAsync(filter, combinedUpdate);

    // This check is technically redundant after ownership check, but safe to keep
    if (result.MatchedCount == 0)
    {
      throw new ArgumentException($"Vehicle with ID {vehicleId} not found.");
    }
  }

  public async Task DeleteAsync(Guid vehicleId, Guid userId)
  {
    var IsVehicleBelongsToUser = await CheckIsVehicleBelongsToUser(userId, vehicleId);
    if (!IsVehicleBelongsToUser)
    {
      throw new ArgumentException("Vehicle not associated with the user.", nameof(vehicleId));
    }

    await _repository.DeleteAsync(vehicleId);
    await _userService.DetachVehicleAsync(vehicleId, userId);
    await _serviceHistoryService.DeleteAllByVehicleIdAsync(vehicleId, userId);
  }

  public async Task<List<VehicleListItemDto>> GetAllByUserAsync(Guid userId)
  {
    var user = await _userService.GetByIdAsync(userId);

    if (user == null)
    {
      throw new ArgumentException("User not found.", nameof(userId));
    }

    if (user.VehicleIds == null || user.VehicleIds.Count == 0)
    {
      return [];
    }

    var vehicleEntities = await _repository.GetByIdsAsync(user.VehicleIds);
    var vehicles = vehicleEntities.Select(v => new VehicleListItemDto
    {
      Id = v.Id,
      LicensePlate = v.LicensePlate,
      Brand = v.Brand,
      Model = v.Model,
      Year = v.Year,
      PhotoUrl = v.PhotoUrl,
    }).ToList();

    return vehicles;
  }

  public async Task CreateAsync(CreateVehicleDto createVehicleDto, Guid userId)
  {
    var vehicle = new VehicleEntity
    {
      Id = Guid.NewGuid(),
      Vin = createVehicleDto.Vin,
      Model = createVehicleDto.Model,
      UpdatedAt = null,
      CreatedAt = DateTime.UtcNow,
      BoughtAt = createVehicleDto.BoughtAt,
      Color = createVehicleDto.Color,
      LicensePlate = createVehicleDto.LicensePlate,
      Brand = createVehicleDto.Brand,
      EngineCapacity = createVehicleDto.EngineCapacity,
      EnginePower = createVehicleDto.EnginePower,
      FuelType = createVehicleDto.FuelType,
      TransmissionType = createVehicleDto.TransmissionType,
      Mileage = createVehicleDto.Mileage,
      WheelDriveType = createVehicleDto.WheelDriveType,
      Year = createVehicleDto.Year,
    };

    // var isExist = await _repository.VinExistsAsync(vehicle.Vin);
    // if (isExist)
    // {
    //   throw new ArgumentException("A vehicle with the same VIN already exists.", nameof(createVehicleDto.Vin));
    // }

    await _repository.CreateAsync(vehicle);
    await _userService.AttachVehicleAsync(vehicle.Id, userId);
  }

  private async Task<bool> CheckIsVehicleBelongsToUser(Guid userId, Guid vehicleId)
  {
    var user = await _userService.GetByIdAsync(userId);
    if (user == null)
    {
      throw new ArgumentException("User not found.", nameof(userId));
    }

    if (user.VehicleIds == null || !user.VehicleIds.Contains(vehicleId))
    {
      return false;
    }

    return true;
  }

  public async Task<PagedResultDto<AdminVehicleListItemDto>> GetAllVehiclesAsync(int page, int pageSize)
  {
    var (skip, limit) = PaginationHelper.Normalize(page, pageSize);

    var vehicles = await _repository.GetAllVehiclesAsync(skip, limit);
    var totalItems = (int)await _repository.GetCountAsync();
    var ownerMap = await _userService.GetOwnerMapByVehicleIdsAsync(vehicles.Select(v => v.Id).ToList());
    var items = vehicles.Select(v => MapAdminVehicleListItem(v, ownerMap)).ToList();

    return new PagedResultDto<AdminVehicleListItemDto>
    {
      Items = items,
      TotalItems = totalItems,
    };
  }


  private static AdminVehicleListItemDto MapAdminVehicleListItem(
  VehicleEntity vehicle,
  IReadOnlyDictionary<Guid, Guid> ownerMap
)
  {
    if (!ownerMap.TryGetValue(vehicle.Id, out var ownerUserId))
    {
      throw new InvalidOperationException(
        $"Vehicle {vehicle.Id} has no assigned owner."
      );
    }

    return new AdminVehicleListItemDto()
    {
      Id = vehicle.Id,
      LicensePlate = vehicle.LicensePlate,
      Brand = vehicle.Brand,
      Model = vehicle.Model,
      Year = vehicle.Year,
      PhotoUrl = vehicle.PhotoUrl,
      OwnerUserId = ownerUserId,
    };
  }
}
