using MainHub.Api.Services;
using MainHub.Api.DTOs;
using MainHub.Api.Filters;
using MainHub.Api.Config;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace MainHub.Api.Endpoints;

public static class UserEndpoints
{
  public static void MapUserEndpoints(this IEndpointRouteBuilder app)
  {
    var users = app
      .MapGroup("/api/user")
      .WithTags("User")
      .RequireAuthorization("RequireInternalJwt"); // Only Internal JWT tokens allowed
    var _contentType = "application/json";

    users.MapPut("/update", UpdateAsync)
      .WithSummary("Update the authenticated user's information")
      .Accepts<UpdateUserDto>(_contentType)
      .AddEndpointFilter<ValidationFilter<UpdateUserDto>>()
      .Produces(StatusCodes.Status204NoContent)
      .ProducesValidationProblem();

    users
      .MapGet("/me", GetMeAsync)
      .WithSummary("Get the authenticated user's information")
      .Produces<GetMeDto>(StatusCodes.Status200OK);

    app.MapGet("/api/admin/drivers", GetDriversAsync)
      .WithTags("Admin")
      .RequireAuthorization("RequireAdminJwt")
      .WithSummary("Get paged list of mobile drivers")
      .Produces<PagedResultDto<DriverListItemDto>>(StatusCodes.Status200OK);

    app.MapGet("/api/admin/drivers/{driverId}", GetDriverByIdAsync)
      .WithTags("Admin")
      .RequireAuthorization("RequireAdminJwt")
      .WithSummary("Get driver details by id for admin")
      .Produces<AdminDriverDetailsDto>(StatusCodes.Status200OK);

    app.MapGet("/api/admin/drivers/{driverId}/vehicles", GetDriverVehiclesAsync)
      .WithTags("Admin")
      .RequireAuthorization("RequireAdminJwt")
      .WithSummary("Get vehicles for a specific driver")
      .Produces<List<VehicleListItemDto>>(StatusCodes.Status200OK);
  }

  internal static async Task<IResult> UpdateAsync(
    ClaimsPrincipal userClaims,
    UpdateUserDto userDto,
    IUserService userService,
    ITokenService tokenService,
    ILogger<Program> logger
  )
  {
    try
    {
      var userId = tokenService.GetUserIdFromClaims(userClaims);

      logger.LogInformation("UpdateAsync called by userId: {UserId}", userId);

      await userService.UpdateAsync(userDto, userId);
      return Results.NoContent();
    }
    catch (ArgumentException)
    {
      logger.LogWarning("UpdateAsync failed: UserId claim is missing or invalid");
      return Results.BadRequest("UserId claim is missing or invalid.");
    }
  }

  internal static async Task<IResult> GetMeAsync(
    ClaimsPrincipal userClaims,
    IUserService userService,
    ITokenService tokenService,
    ILogger<Program> logger
  )
  {
    try
    {
      var userId = tokenService.GetUserIdFromClaims(userClaims);

      logger.LogInformation("GetMe called by userId: {UserId}", userId);

      var getMeData = await userService.GetMeByUserIdAsync(userId);
      return Results.Ok(getMeData);
    }
    catch (ArgumentException)
    {
      logger.LogWarning("GetMe failed: UserId claim is missing or invalid");
      return Results.BadRequest("UserId claim is missing or invalid.");
    }
  }

  internal static async Task<IResult> DeleteAsync(
    Guid id,
    IUserService userService
  )
  {
    await userService.DeleteAsync(id);
    return Results.NoContent();
  }

  internal static async Task<IResult> GetDriversAsync(
    ClaimsPrincipal userClaims,
    [AsParameters] AdminDriverQueryDto query,
    IUserService userService,
    IOptions<AdminSettings> adminSettings
  )
  {
    var safePage = query.Page <= 0 ? 1 : query.Page;
    var safePageSize = query.PageSize <= 0 ? 20 : Math.Min(query.PageSize, 100);
    query.Page = safePage;
    query.PageSize = safePageSize;
    var allowedAdminTelegramIds = adminSettings.Value.AllowedTelegramIds ?? [];
    var currentAdminUserId = userClaims.FindFirst("userId")?.Value;

    if (
      string.IsNullOrWhiteSpace(currentAdminUserId) ||
      !allowedAdminTelegramIds.Contains(currentAdminUserId)
    )
    {
      return Results.Forbid();
    }

    var (drivers, totalItems) = await userService.GetDriversPagedAsync(query);

    var totalPages = totalItems == 0
      ? 0
      : (int)Math.Ceiling(totalItems / (double)safePageSize);

    return Results.Ok(new PagedResultDto<DriverListItemDto>
    {
      Items = drivers.Select(d => d.ToDriverListItemDto()).ToList(),
      Page = safePage,
      PageSize = safePageSize,
      TotalItems = totalItems,
      TotalPages = totalPages
    });
  }

  internal static async Task<IResult> GetDriverByIdAsync(
    ClaimsPrincipal userClaims,
    Guid driverId,
    IUserService userService,
    IOptions<AdminSettings> adminSettings
  )
  {
    var allowedAdminTelegramIds = adminSettings.Value.AllowedTelegramIds ?? [];
    var currentAdminUserId = userClaims.FindFirst("userId")?.Value;

    if (
      string.IsNullOrWhiteSpace(currentAdminUserId) ||
      !allowedAdminTelegramIds.Contains(currentAdminUserId)
    )
    {
      return Results.Forbid();
    }

    var user = await userService.GetByIdAsync(driverId);
    if (user is null)
    {
      return Results.NotFound();
    }

    return Results.Ok(user.ToAdminDriverDetailsDto());
  }

  internal static async Task<IResult> GetDriverVehiclesAsync(
    ClaimsPrincipal userClaims,
    Guid driverId,
    IUserService userService,
    IVehicleService vehicleService,
    IOptions<AdminSettings> adminSettings
  )
  {
    var allowedAdminTelegramIds = adminSettings.Value.AllowedTelegramIds ?? [];
    var currentAdminUserId = userClaims.FindFirst("userId")?.Value;

    if (
      string.IsNullOrWhiteSpace(currentAdminUserId) ||
      !allowedAdminTelegramIds.Contains(currentAdminUserId)
    )
    {
      return Results.Forbid();
    }

    var user = await userService.GetByIdAsync(driverId);
    if (user is null)
    {
      return Results.NotFound();
    }

    var vehicles = await vehicleService.GetAllByUserAsync(driverId);
    return Results.Ok(vehicles);
  }
}
