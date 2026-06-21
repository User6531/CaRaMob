using MainHub.Api.Services;
using MainHub.Api.DTOs;
using MainHub.Api.Filters;
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
    [AsParameters] AdminDriverQueryDto query,
    IUserService userService
  )
  {
    var result = await userService.GetAdminDriversPagedAsync(query);
    return Results.Ok(result);
  }

  internal static async Task<IResult> GetDriverByIdAsync(
    Guid driverId,
    IUserService userService
  )
  {
    var driver = await userService.GetAdminDriverByIdAsync(driverId);
    return driver is null ? Results.NotFound() : Results.Ok(driver);
  }

  internal static async Task<IResult> GetDriverVehiclesAsync(
    Guid driverId,
    IVehicleService vehicleService
  )
  {
    var vehicles = await vehicleService.GetAdminDriverVehiclesAsync(driverId);
    return vehicles is null ? Results.NotFound() : Results.Ok(vehicles);
  }
}
