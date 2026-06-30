using MainHub.Api.Models;
using MainHub.Api.Repositories;
using MainHub.Api.DTOs;
using MainHub.Api.Shared;
using MongoDB.Driver;

namespace MainHub.Api.Services;

/// <summary>
/// Defines methods for managing user entities.
/// </summary>
public interface IUserService
{
  /// <summary>
  /// Updates an existing user asynchronously.
  /// </summary>
  /// <param name="userDto">The user DTO containing updated information.</param>
  Task UpdateAsync(UpdateUserDto userDto, Guid userId);

  /// <summary>
  /// Retrieves the current user's information based on the provider ID asynchronously.
  /// </summary>
  /// <param name="providerId">The provider identifier of the user.</param>
  /// <returns>
  /// A task that represents the asynchronous operation. 
  /// The task result contains a <see cref="UserEntity"/> with the user's information if found; otherwise, <c>null</c>.
  /// </returns>
  Task<UserEntity?> GetUserByProviderIdAsync(string providerId);

  /// <summary>
  /// Retrieves the current user's information based on the user ID asynchronously.
  /// </summary>
  /// <param name="userId">The user ID of the user.</param>
  /// <returns>
  /// A task that represents the asynchronous operation. 
  /// The task result contains a <see cref="GetMeDto"/> with the user's information.
  /// </returns>
  Task<GetMeDto> GetMeByUserIdAsync(Guid userId);

  /// <summary>
  /// Retrieves a list of all users asynchronously.
  /// </summary>
  /// <returns>
  /// A task that represents the asynchronous operation. 
  /// The task result contains a list of <see cref="UserEntity"/> objects.
  /// </returns>
  Task<List<UserEntity>> GetAllAsync();

  /// <summary>
  /// Retrieves a user by their unique identifier asynchronously.
  /// </summary>
  /// <param name="id">The unique identifier of the user.</param>
  /// <returns>
  /// A task that represents the asynchronous operation. 
  /// The task result contains the <see cref="UserEntity"/> if found; otherwise, <c>null</c>.
  /// </returns>
  Task<UserEntity?> GetByIdAsync(Guid id);

  /// <summary>
  /// Creates a new user asynchronously.
  /// </summary>
  /// <param name="name">The name of the user.</param>
  /// <param name="email">The email of the user.</param>
  /// <param name="providerId">The provider identifier of the user.</param>
  /// <param name="phone">The phone number of the user.</param>
  /// <param name="pictureUrl">The URL of the user's profile picture.</param>
  /// <returns>A task that represents the asynchronous operation.</returns>
  Task<UserEntity> CreateAsync(string name, string? email, string providerId, string? phone, string? pictureUrl);

  /// <summary>
  /// Deletes a user by their unique identifier asynchronously.
  /// </summary>
  /// <param name="id">The unique identifier of the user to delete.</param>
  /// <returns>A task that represents the asynchronous operation.</returns>
  Task DeleteAsync(Guid id);
  Task<Dictionary<Guid, Guid>> GetOwnerMapByVehicleIdsAsync(IReadOnlyCollection<Guid> vehicleIds);

  /// <summary>
  /// Retrieves a paged list of users asynchronously.
  /// </summary>
  /// <param name="page">The page number to retrieve.</param>
  /// <param name="pageSize">The number of items per page.</param>
  /// <returns>A task that represents the asynchronous operation.</returns>
  Task<PagedResultDto<AdminUserListItemDto>> GetAllUsersAsync(int page, int pageSize);

  /// <summary>
  /// Attach a new vehicle to user asynchronously.
  /// </summary>
  Task AttachVehicleAsync(Guid vehicleId, Guid userId);

  /// <summary>
  /// Detach a vehicle from user asynchronously.
  /// </summary>
  Task DetachVehicleAsync(Guid vehicleId, Guid userId);
}

public class UserService(IUserRepository repository) : IUserService
{
  private readonly IUserRepository _repository = repository;

  public async Task DetachVehicleAsync(Guid vehicleId, Guid userId)
  {
    var filter = Builders<UserEntity>.Filter.Eq(u => u.Id, userId);
    var update = Builders<UserEntity>.Update
      .Pull(u => u.VehicleIds, vehicleId);

    var result = await _repository.UpdateOneAsync(filter, update);

    if (result.MatchedCount == 0)
    {
      throw new KeyNotFoundException($"User with ID {userId} not found.");
    }
  }

  public async Task AttachVehicleAsync(Guid vehicleId, Guid userId)
  {
    var filter = Builders<UserEntity>.Filter.Eq(u => u.Id, userId);
    var update = Builders<UserEntity>.Update
      .AddToSet(u => u.VehicleIds, vehicleId);

    var result = await _repository.UpdateOneAsync(filter, update);

    if (result.MatchedCount == 0)
    {
      throw new KeyNotFoundException($"User with ID {userId} not found.");
    }
  }

  public async Task UpdateAsync(UpdateUserDto userDto, Guid userId)
  {
    var filter = Builders<UserEntity>.Filter.Eq(u => u.Id, userId);
    var updateBuilder = Builders<UserEntity>.Update.Set(u => u.UpdatedAt, DateTime.UtcNow);

    if (!string.IsNullOrWhiteSpace(userDto.Name))
    {
      updateBuilder = updateBuilder.Set(u => u.Name, userDto.Name);
    }

    if (!string.IsNullOrWhiteSpace(userDto.Email))
    {
      updateBuilder = updateBuilder.Set(u => u.Email, userDto.Email);
    }

    var result = await _repository.UpdateOneAsync(filter, updateBuilder);

    if (result.MatchedCount == 0)
    {
      throw new KeyNotFoundException($"User with ID {userId} not found.");
    }
  }

  public async Task<UserEntity?> GetUserByProviderIdAsync(string providerId)
  {
    return await _repository.GetByProviderIdAsync(providerId);
  }

  public async Task<GetMeDto> GetMeByUserIdAsync(Guid userId)
  {
    var user = await _repository.GetByIdAsync(userId);
    if (user is null)
    {
      throw new KeyNotFoundException("User not found.");
    }

    return (GetMeDto)user;
  }

  public async Task<List<UserEntity>> GetAllAsync() => await _repository.GetAllAsync();

  public async Task<UserEntity?> GetByIdAsync(Guid id) => await _repository.GetByIdAsync(id);

  public async Task<UserEntity> CreateAsync(
    string name,
    string? email,
    string providerId,
    string? phone,
    string? pictureUrl
  )
  {
    var now = DateTime.UtcNow;
    var userEntity = new UserEntity
    {
      Id = Guid.NewGuid(),
      Name = name,
      Email = email,
      ProviderId = providerId,
      CreatedAt = now,
      UpdatedAt = null,
      Phone = phone,
      PictureUrl = pictureUrl,
      VehicleIds = []
    };

    await _repository.CreateAsync(userEntity);

    return userEntity;
  }

  public async Task DeleteAsync(Guid id) => await _repository.DeleteAsync(id);

  public async Task<Dictionary<Guid, Guid>> GetOwnerMapByVehicleIdsAsync(
    IReadOnlyCollection<Guid> vehicleIds
  )
  {
    var users = await _repository.GetByVehicleIdsAsync(vehicleIds);
    var result = new Dictionary<Guid, Guid>();

    foreach (var user in users)
    {
      foreach (var vehicleId in user.VehicleIds)
      {
        if (vehicleIds.Contains(vehicleId))
        {
          result[vehicleId] = user.Id;
        }
      }
    }

    return result;
  }

  public async Task<PagedResultDto<AdminUserListItemDto>> GetAllUsersAsync(
    int page,
    int pageSize
  )
  {
    var (skip, limit) = PaginationHelper.Normalize(page, pageSize);

    var items = await _repository.GetAllUsersPagedAsync(skip, limit);
    var totalItems = (int)await _repository.CountAllUsersAsync();

    return new PagedResultDto<AdminUserListItemDto>
    {
      Items = items.Select(d => (AdminUserListItemDto)d).ToList(),
      TotalItems = totalItems,
    };
  }
}
