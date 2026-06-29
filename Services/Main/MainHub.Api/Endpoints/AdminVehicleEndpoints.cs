using MainHub.Api.DTOs;
using MainHub.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MainHub.Api.Endpoints;

public static partial class AdminVehicleEndpoints
{
  public static void MapAdminVehicleEndpoints(this IEndpointRouteBuilder app)
  {
    var vehicles = app
      .MapGroup("/api/admin/vehicles")
      .WithTags("Admin")
      .RequireAuthorization("RequireAdminJwt");

    vehicles
      .MapGet("", GetAllVehiclesAsync)
      .WithSummary("Get paged vehicles list")
      .Produces<PagedResultDto<VehicleListItemDto>>(StatusCodes.Status200OK);

    vehicles
      .MapGet("/{vehicleId}", GetVehicleByIdAsync)
      .WithSummary("Get single vehicle details for global admin")
      .Produces<VehicleDto>(StatusCodes.Status200OK);

    vehicles
      .MapGet("/{userId}/vehicles", GetVehiclesByUserIdAsync)
      .WithSummary("Get vehicles for a specific driver")
      .Produces<List<VehicleListItemDto>>(StatusCodes.Status200OK);
  }

  internal static async Task<IResult> GetVehicleByIdAsync(
    Guid vehicleId,
    IVehicleService vehicleService
  )
  {
    var vehicle = await vehicleService.GetVehicleByIdAsync(vehicleId);
    return vehicle is null ? Results.NotFound() : Results.Ok(vehicle);
  }

  internal static async Task<IResult> GetAllVehiclesAsync(
    [FromQuery] int page,
    [FromQuery] int pageSize,
    IVehicleService vehicleService
  )
  {
    var result = await vehicleService.GetAllVehiclesAsync(page, pageSize);
    return Results.Ok(result);
  }

  internal static async Task<IResult> GetVehiclesByUserIdAsync(
   Guid userId,
   IVehicleService vehicleService
 )
  {
    var vehicles = await vehicleService.GetAllByUserAsync(userId);
    return vehicles is null ? Results.NotFound() : Results.Ok(vehicles);
  }
}
