using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MainHub.Api.Config;

namespace MainHub.Api.Services;

/// <summary>
/// Defines methods for generating JWT tokens.
/// </summary>
public interface ITokenService
{
    /// <summary>
    /// Generates a JWT token for the specified user.
    /// </summary>
    /// <param name="userId">The unique identifier of the user.</param>
    /// <param name="providerId">The provider identifier of the user.</param>
    /// <returns>A JWT token string.</returns>
    string GenerateToken(Guid userId, string providerId);
}

/// <summary>
/// Service for generating JWT tokens.
/// Note: Token validation is handled automatically by ASP.NET Core's JWT Bearer middleware.
/// </summary>
public class TokenService : ITokenService
{
    private readonly JwtSettings _jwtSettings;
    private readonly SymmetricSecurityKey _key;

    public TokenService(IOptions<JwtSettings> jwtSettings)
    {
        _jwtSettings = jwtSettings.Value;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
    }

    public string GenerateToken(Guid userId, string providerId)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim("userId", userId.ToString()),
            new Claim("providerId", providerId),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // if (!string.IsNullOrEmpty(email))
        // {
        //     claims.Add(new Claim(ClaimTypes.Email, email));
        //     claims.Add(new Claim(JwtRegisteredClaimNames.Email, email));
        // }

        // if (!string.IsNullOrEmpty(name))
        // {
        //     claims.Add(new Claim(ClaimTypes.Name, name));
        //     claims.Add(new Claim(JwtRegisteredClaimNames.Name, name));
        // }

        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: expires,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

