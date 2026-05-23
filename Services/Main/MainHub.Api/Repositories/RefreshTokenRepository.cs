using MainHub.Api.Config;
using MainHub.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace MainHub.Api.Repositories;

public interface IRefreshTokenRepository
{
    Task CreateAsync(RefreshTokenEntity token);
    Task<RefreshTokenEntity?> GetByTokenAsync(string token);
    Task RevokeAsync(Guid id);
    Task DeleteExpiredAsync();
}

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly IMongoCollection<RefreshTokenEntity> _collection;

    public RefreshTokenRepository(IMongoClient client, IOptions<MongoDbSettings> settings)
    {
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _collection = database.GetCollection<RefreshTokenEntity>(settings.Value.RefreshTokenCollectionName);
    }

    public async Task CreateAsync(RefreshTokenEntity token) =>
        await _collection.InsertOneAsync(token);

    public async Task<RefreshTokenEntity?> GetByTokenAsync(string token) =>
        await _collection.Find(t => t.Token == token).FirstOrDefaultAsync();

    public async Task RevokeAsync(Guid id)
    {
        var filter = Builders<RefreshTokenEntity>.Filter.Eq(t => t.Id, id);
        var update = Builders<RefreshTokenEntity>.Update.Set(t => t.IsRevoked, true);
        await _collection.UpdateOneAsync(filter, update);
    }

    public async Task DeleteExpiredAsync()
    {
        var filter = Builders<RefreshTokenEntity>.Filter.Lt(t => t.ExpiresAt, DateTime.UtcNow);
        await _collection.DeleteManyAsync(filter);
    }
}
