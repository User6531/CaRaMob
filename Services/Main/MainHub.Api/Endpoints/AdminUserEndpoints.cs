using MainHub.Api.DTOs;
using MainHub.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MainHub.Api.Endpoints;

public static class AdminUserEndpoints
{
  public static void MapAdminUserEndpoints(this IEndpointRouteBuilder app)
  {
    var users = app
      .MapGroup("/api/admin/user")
      .WithTags("Admin")
      .RequireAuthorization("RequireAdminJwt");

    users.MapGet("", GetAllUsersAsync)
      .WithSummary("Get paged list of all users")
      .Produces<PagedResultDto<AdminUserListItemDto>>(StatusCodes.Status200OK);

    users.MapGet("/{userId}", GetUserByIdAsync)
      .WithSummary("Get user details by id")
      .Produces<AdminUserDetailsDto>(StatusCodes.Status200OK);
  }

  internal static async Task<IResult> GetAllUsersAsync(
    [FromQuery] int page,
    [FromQuery] int pageSize,
    IUserService userService
  )
  {
    var result = await userService.GetAllUsersAsync(page, pageSize);
    return Results.Ok(result);
  }

  internal static async Task<IResult> GetUserByIdAsync(
    [FromRoute] Guid userId,
    IUserService userService
  )
  {
    var user = await userService.GetByIdAsync(userId);
    if (user is null)
    {
      return Results.NotFound();
    }
    var result = new AdminUserDetailsDto()
    {
      Id = user.Id,
      Name = user.Name,
      Email = user.Email,
      Phone = user.Phone,
      PictureUrl = user.PictureUrl,
      ProviderId = user.ProviderId,
      CreatedAt = user.CreatedAt,
    };

    return Results.Ok(result);
  }
}
