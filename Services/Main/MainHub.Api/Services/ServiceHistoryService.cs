using MongoDB.Driver;
using MainHub.Api.DTOs.ServiceHistory;
using MainHub.Api.DTOs;
using MainHub.Api.Repositories;
using MainHub.Api.Models;

namespace MainHub.Api.Services;

/// <summary>
/// Defines methods for managing service history entities.
/// </summary>
public interface IServiceHistoryService
{
  /// <summary>
  /// Retrieves all service history records associated with a vehicle asynchronously.
  /// </summary>
  /// <param name="vehicleId">The unique identifier of the vehicle.</param>
  /// <param name="userId">The unique identifier of the user.</param>
  Task<ServiceHistoryListDto> GetAllByVehicleIdAsync(Guid vehicleId, Guid userId);

  /// <summary>
  /// Deletes a service history record associated with a vehicle asynchronously.
  /// </summary>
  /// <param name="vehicleId">The unique identifier of the vehicle.</param>
  /// <param name="serviceHistoryId">The unique identifier of the service history record to delete.</param>
  /// <param name="userId">The unique identifier of the user.</param>
  Task DeleteAsync(Guid vehicleId, Guid serviceHistoryId, Guid userId);

  /// <summary>
  /// Deletes all service history records associated with a vehicle asynchronously.
  /// </summary>
  /// <param name="vehicleId">The unique identifier of the vehicle.</param>
  /// <param name="userId">The unique identifier of the user.</param>
  /// <returns>A task that represents the asynchronous operation.</returns>
  Task DeleteAllByVehicleIdAsync(Guid vehicleId, Guid userId);

  /// <summary>
  /// Retrieves a service history record by its unique identifier asynchronously.
  /// </summary>
  /// <param name="vehicleId">The unique identifier of the vehicle.</param>
  /// <param name="serviceHistoryId">The unique identifier of the service history record.</param>
  /// <param name="userId">The unique identifier of the user.</param>
  /// <returns>A task that represents the asynchronous operation. The task result contains the service history details.</returns>
  Task<ServiceHistoryDetailsDto> GetServiceHistoryByIdAsync(Guid vehicleId, Guid serviceHistoryId, Guid userId);

  /// <summary>
  /// Creates a new service history record for a vehicle asynchronously.
  /// </summary>
  /// <param name="vehicleId">The unique identifier of the vehicle.</param>
  /// <param name="serviceHistoryDetails">The details of the service history record to create.</param>
  /// <param name="userId">The unique identifier of the user.</param>
  /// <returns>A task that represents the asynchronous operation.</returns>
  Task CreateAsync(Guid vehicleId, CreateServiceHistoryDetailsDto serviceHistoryDetails, Guid userId);

  /// <summary>
  /// Updates a service history record for a vehicle asynchronously.
  /// </summary>
  /// <param name="vehicleId">The unique identifier of the vehicle.</param>
  /// <param name="serviceHistoryId">The unique identifier of the service history record to update.</param>
  /// <param name="updateServiceHistoryDetailsDto">The details of the service history record to update.</param>
  /// <param name="userId">The unique identifier of the user.</param>
  /// <returns>A task that represents the asynchronous operation.</returns>
  Task UpdateAsync(Guid vehicleId, Guid serviceHistoryId, CreateServiceHistoryDetailsDto updateServiceHistoryDetailsDto, Guid userId);
  Task<List<AdminServiceHistoryVisitDto>> GetAdminVisitsByVehicleIdAsync(Guid vehicleId);
  Task<List<ServiceHistoryRecordDto>> GetAdminRecordsByServiceHistoryIdAsync(Guid serviceHistoryId);
}

public class ServiceHistoryService(
  IServiceHistoryRepository repository,
  IUserService userService
) : IServiceHistoryService
{
  private readonly IServiceHistoryRepository _repository = repository;
  private readonly IUserService _userService = userService;

  public async Task DeleteAllByVehicleIdAsync(Guid vehicleId, Guid userId)
  {
    await EnsureValidVehicleRequest(userId, vehicleId);
    await _repository.DeleteAllByVehicleIdAsync(vehicleId);
  }

  public async Task UpdateAsync(Guid vehicleId, Guid serviceHistoryId, CreateServiceHistoryDetailsDto updateServiceHistoryDetailsDto, Guid userId)
  {
    await EnsureValidVehicleRequest(userId, vehicleId);

    var existingServiceHistory = await _repository.GetByIdAsync(vehicleId, serviceHistoryId);

    if (existingServiceHistory == null)
    {
      throw new ArgumentException("The specified service history record does not found.", nameof(serviceHistoryId));
    }

    var newServiceHistoryEntity = new ServiceHistoryEntity
    {
      Id = existingServiceHistory.Id,
      VehicleId = existingServiceHistory.VehicleId,
      CreatedAt = existingServiceHistory.CreatedAt,
      Title = updateServiceHistoryDetailsDto.Title,
      UpdatedAt = DateTime.UtcNow,
      Description = updateServiceHistoryDetailsDto.Description,
      Records = updateServiceHistoryDetailsDto.Records.Select(r => new ServiceHistoryRecordModel
      {
        Id = Guid.NewGuid(),
        Title = r.Title,
        Price = r.Price,
        Description = r.Description,
      }).ToList()
    };

    var isUpdateSuccess = await _repository.UpdateAsync(newServiceHistoryEntity);
    if (!isUpdateSuccess)
    {
      throw new Exception("Failed to update the service history record.");
    }
  }

  public async Task CreateAsync(Guid vehicleId, CreateServiceHistoryDetailsDto serviceHistoryDetails, Guid userId)
  {
    await EnsureValidVehicleRequest(userId, vehicleId);

    var serviceHistoryEntity = new ServiceHistoryEntity
    {
      Id = Guid.NewGuid(),
      VehicleId = vehicleId,
      Title = serviceHistoryDetails.Title,
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = null,
      Description = serviceHistoryDetails.Description,
      Records = serviceHistoryDetails.Records.Select(r => new ServiceHistoryRecordModel
      {
        Id = Guid.NewGuid(),
        Title = r.Title,
        Price = r.Price,
        Description = r.Description,
      }).ToList()

    };

    await _repository.CreateAsync(serviceHistoryEntity);
  }

  public async Task<ServiceHistoryDetailsDto> GetServiceHistoryByIdAsync(Guid vehicleId, Guid serviceHistoryId, Guid userId)
  {
    await EnsureValidVehicleRequest(userId, vehicleId);

    var serviceHistoryEntity = await _repository.GetByIdAsync(vehicleId, serviceHistoryId);

    if (serviceHistoryEntity == null)
    {
      throw new ArgumentException("The specified service history record does not found.", nameof(serviceHistoryId));
    }

    var serviceHistoryDetails = new ServiceHistoryDetailsDto
    {
      CreatedAt = serviceHistoryEntity.CreatedAt,
      Id = serviceHistoryEntity.Id,
      Title = serviceHistoryEntity.Title,
      UpdatedAt = serviceHistoryEntity.UpdatedAt,
      Description = serviceHistoryEntity.Description,
      Records = serviceHistoryEntity.Records.Select(r => new ServiceHistoryRecordDto
      {
        Id = r.Id,
        Title = r.Title,
        Price = r.Price,
        Description = r.Description,
      }).ToList()
    };

    return serviceHistoryDetails;
  }

  public async Task DeleteAsync(Guid vehicleId, Guid serviceHistoryId, Guid userId)
  {
    await EnsureValidVehicleRequest(userId, vehicleId);
    var isDeleteSuccess = await _repository.DeleteAsync(serviceHistoryId);
    if (!isDeleteSuccess)
    {
      throw new Exception("Failed to delete the service history record.");
    }
  }

  public async Task<ServiceHistoryListDto> GetAllByVehicleIdAsync(Guid vehicleId, Guid userId)
  {
    await EnsureValidVehicleRequest(userId, vehicleId);

    var serviceHistoryEntities = await _repository.GetAllByVehicleIdAsync(vehicleId);

    var serviceHistoryItems = serviceHistoryEntities.Select(sh => new ServiceHistoryListItemDto
    {
      Id = sh.Id,
      Title = sh.Title,
      Description = sh.Description,
      CreatedAt = sh.CreatedAt,
    }).ToList();

    var serviceHistoryList = new ServiceHistoryListDto
    {
      Items = serviceHistoryItems
    };

    return serviceHistoryList;
  }

  private async Task EnsureValidVehicleRequest(Guid userId, Guid vehicleId)
  {
    var user = await _userService.GetByIdAsync(userId);

    if (user == null)
    {
      throw new ArgumentException("User not found.", nameof(userId));
    }

    if (user.VehicleIds == null || user.VehicleIds.Count == 0)
    {
      throw new ArgumentException("Vehicles not found for the specified user.", nameof(userId));
    }

    var isVehicleBelongsToUser = user.VehicleIds.Contains(vehicleId);

    if (!isVehicleBelongsToUser)
    {
      throw new ArgumentException("The specified vehicle does not found.", nameof(vehicleId));
    }
  }

  public async Task<List<AdminServiceHistoryVisitDto>> GetAdminVisitsByVehicleIdAsync(Guid vehicleId)
  {
    var visits = await _repository.GetAllByVehicleIdAsync(vehicleId);
    return visits.Select(v => new AdminServiceHistoryVisitDto
    {
      Id = v.Id,
      VehicleId = v.VehicleId,
      Title = v.Title,
      Description = v.Description,
      CreatedAt = v.CreatedAt,
      UpdatedAt = v.UpdatedAt
    }).ToList();
  }

  public async Task<List<ServiceHistoryRecordDto>> GetAdminRecordsByServiceHistoryIdAsync(
    Guid serviceHistoryId
  )
  {
    var visit = await _repository.GetByServiceHistoryIdAsync(serviceHistoryId);
    if (visit is null)
    {
      throw new KeyNotFoundException("Service history visit not found.");
    }

    return visit.Records.Select(r => new ServiceHistoryRecordDto
    {
      Id = r.Id,
      Title = r.Title,
      Description = r.Description,
      Price = r.Price
    }).ToList();
  }
}