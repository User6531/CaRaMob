using MainHub.Api.Models;

namespace MainHub.Api.DTOs;

public class AdminUserDetailsDto
{
  public required Guid Id { get; set; }
  public required string Name { get; set; }
  public string? Email { get; set; }
  public string? Phone { get; set; }
  public string? PictureUrl { get; set; }
  public required string ProviderId { get; set; }
  public required DateTime CreatedAt { get; set; }

  public static explicit operator AdminUserDetailsDto(UserEntity user) =>
    new()
    {
      Id = user.Id,
      Name = user.Name,
      Email = user.Email,
      Phone = user.Phone,
      PictureUrl = user.PictureUrl,
      ProviderId = user.ProviderId,
      CreatedAt = user.CreatedAt,
    };
}
