using MongoDB.Driver;
using Microsoft.Extensions.Options;
using MainHub.Api.Models;
using MainHub.Api.Config;

namespace MainHub.Api.Repositories;

/// <summary>
/// Defines methods for managing user entities in the data store.
/// </summary>
public interface IUserRepository
{
    /// <summary>
    /// Replaces an existing user entity asynchronously.
    /// </summary>
    /// <param name="user">The user entity to update.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task ReplaceAsync(UserEntity user);

    /// <summary>
    /// Retrieves a user entity by its provider identifier asynchronously.
    /// </summary>
    /// <param name="providerId">The provider identifier of the user.</param>
    /// <returns>
    /// A task that represents the asynchronous operation.
    /// The task result contains the <see cref="UserEntity"/> if found; otherwise, <c>null</c>.
    /// </returns>
    Task<UserEntity?> GetByProviderIdAsync(string providerId);

    /// <summary>
    /// Retrieves all user entities asynchronously.
    /// </summary>
    /// <returns>
    /// A task that represents the asynchronous operation.
    /// The task result contains a list of <see cref="UserEntity"/> objects.
    /// </returns>
    Task<List<UserEntity>> GetAllAsync();

    /// <summary>
    /// Retrieves a user entity by its unique identifier asynchronously.
    /// </summary>
    /// <param name="id">The unique identifier of the user.</param>
    /// <returns>
    /// A task that represents the asynchronous operation.
    /// The task result contains the <see cref="UserEntity"/> if found; otherwise, <c>null</c>.
    /// </returns>
    Task<UserEntity?> GetByIdAsync(Guid id);

    /// <summary>
    /// Creates a new user entity asynchronously.
    /// </summary>
    /// <param name="user">The user entity to create.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task CreateAsync(UserEntity user);

    /// <summary>
    /// Deletes a user entity by its unique identifier asynchronously.
    /// </summary>
    /// <param name="id">The unique identifier of the user to delete.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task DeleteAsync(Guid id);
}

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<UserEntity> _users;

    public UserRepository(IMongoClient client, IOptions<MongoDbSettings> settings)
    {
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _users = database.GetCollection<UserEntity>(settings.Value.UserCollectionName);
    }

    public async Task ReplaceAsync(UserEntity user)
    {
        var filter = Builders<UserEntity>.Filter.Eq(u => u.Id, user.Id);
        await _users.ReplaceOneAsync(filter, user);
    }

    public async Task<UserEntity?> GetByProviderIdAsync(string providerId) =>
        await _users.Find(u => u.ProviderId == providerId).FirstOrDefaultAsync();

    public async Task<List<UserEntity>> GetAllAsync() =>
        await _users.Find(_ => true).ToListAsync();

    public async Task<UserEntity?> GetByIdAsync(Guid id) =>
        await _users.Find(u => u.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(UserEntity user) =>
        await _users.InsertOneAsync(user);

    public async Task DeleteAsync(Guid id) =>
        await _users.DeleteOneAsync(u => u.Id == id);
}
