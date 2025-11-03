using MainHub.Api.Models;
using MainHub.Api.Repositories;
using MainHub.Api.DTOs;

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
  /// <returns>A task that represents the asynchronous operation.</returns>
  Task<UserEntity> CreateAsync(string name, string email, string providerId);

  /// <summary>
  /// Deletes a user by their unique identifier asynchronously.
  /// </summary>
  /// <param name="id">The unique identifier of the user to delete.</param>
  /// <returns>A task that represents the asynchronous operation.</returns>
  Task DeleteAsync(Guid id);
}

public class UserService(IUserRepository repository) : IUserService
{
  private readonly IUserRepository _repository = repository;

  public async Task UpdateAsync(UpdateUserDto userDto, Guid userId)
  {
    var existingUser = await _repository.GetByIdAsync(userId);

    if (existingUser is null)
    {
      throw new KeyNotFoundException("User not found.");
    }

    // Update only the fields that are provided in the DTO
    if (userDto.Name is not null)
      existingUser.Name = userDto.Name;

    if (userDto.Email is not null)
      existingUser.Email = userDto.Email;

    // Update the last modified timestamp
    existingUser.UpdatedAt = DateTime.UtcNow;

    await _repository.ReplaceAsync(existingUser);
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
    string email,
    string providerId
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
      UpdatedAt = null
    };

    await _repository.CreateAsync(userEntity);

    return userEntity;
  }

  public async Task DeleteAsync(Guid id) => await _repository.DeleteAsync(id);
}
