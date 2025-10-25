
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
  Task UpdateAsync(UpdateUserDto userDto);

  /// <summary>
  /// Retrieves the current user's information based on the provider ID asynchronously.
  /// </summary>
  /// <param name="providerId">The provider identifier of the user.</param>
  /// <returns>
  /// A task that represents the asynchronous operation. 
  /// The task result contains a <see cref="GetMeDto"/> with the user's information.
  /// </returns>
  Task<GetMeDto> GetMeAsync(string providerId);

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
  /// <param name="user">The user entity to create.</param>
  /// <returns>A task that represents the asynchronous operation.</returns>
  Task CreateAsync(CreateUserDto user, string providerId);

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

  public async Task UpdateAsync(UpdateUserDto userDto)
  {
    var existingUser = await _repository.GetByIdAsync(userDto.Id);

    if (existingUser is null)
    {
      throw new KeyNotFoundException("User not found.");
    }

    // Update only the fields that are provided in the DTO
    if (userDto.Name is not null)
      existingUser.Name = userDto.Name;

    if (userDto.Email is not null)
      existingUser.Email = userDto.Email;

    await _repository.ReplaceAsync(existingUser);
  }


  public async Task<GetMeDto> GetMeAsync(string providerId)
  {
    var user = await _repository.GetByProviderIdAsync(providerId);
    if (user is null)
    {
      return new GetMeDto
      {
        IsRegistered = false,
        UserData = null
      };
    }

    return new GetMeDto
    {
      IsRegistered = true,
      UserData = new UserInfo
      {
        Name = user.Name,
        Id = user.Id
      }
    };
  }

  public async Task<List<UserEntity>> GetAllAsync() => await _repository.GetAllAsync();

  public async Task<UserEntity?> GetByIdAsync(Guid id) => await _repository.GetByIdAsync(id);

  public async Task CreateAsync(CreateUserDto user, string providerId)
  {
    var userEntity = new UserEntity
    {
      Id = Guid.NewGuid(),
      Name = user.Name,
      Email = user.Email,
      ProviderId = providerId
    };
    await _repository.CreateAsync(userEntity);
  }

  public async Task DeleteAsync(Guid id) => await _repository.DeleteAsync(id);
}
