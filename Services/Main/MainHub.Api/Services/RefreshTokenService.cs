using MainHub.Api.Config;
using MainHub.Api.Models;
using MainHub.Api.Repositories;
using Microsoft.Extensions.Options;

namespace MainHub.Api.Services;

public interface IRefreshTokenService
{
    Task<RefreshTokenEntity> CreateAsync(Guid userId, string providerId);
    Task<RefreshTokenEntity?> ValidateAndRotateAsync(string token);
}

public class RefreshTokenService : IRefreshTokenService
{
    private readonly IRefreshTokenRepository _repo;
    private readonly ITokenService _tokenService;
    private readonly int _expirationDays;

    public RefreshTokenService(
        IRefreshTokenRepository repo,
        ITokenService tokenService,
        IOptions<JwtSettings> jwtSettings)
    {
        _repo = repo;
        _tokenService = tokenService;
        _expirationDays = jwtSettings.Value.RefreshTokenExpirationDays;
    }

    public async Task<RefreshTokenEntity> CreateAsync(Guid userId, string providerId)
    {
        var entity = new RefreshTokenEntity
        {
            Id = Guid.NewGuid(),
            Token = _tokenService.GenerateRefreshToken(),
            UserId = userId,
            ProviderId = providerId,
            ExpiresAt = DateTime.UtcNow.AddDays(_expirationDays),
            CreatedAt = DateTime.UtcNow,
            IsRevoked = false
        };

        await _repo.CreateAsync(entity);
        return entity;
    }

    /// <summary>
    /// Validates the incoming refresh token and, if valid, revokes it and issues a fresh one (rotation).
    /// Returns null if the token is invalid, expired, or revoked.
    /// </summary>
    public async Task<RefreshTokenEntity?> ValidateAndRotateAsync(string token)
    {
        var existing = await _repo.GetByTokenAsync(token);

        if (existing is null || existing.IsRevoked || existing.ExpiresAt <= DateTime.UtcNow)
            return null;

        await _repo.RevokeAsync(existing.Id);

        return await CreateAsync(existing.UserId, existing.ProviderId);
    }
}
