using System.Security.Claims;
using MainHub.Api.Services;
using MainHub.Api.DTOs.ServiceHistory;
using MainHub.Api.Filters;

namespace MainHub.Api.Endpoints;

public static partial class ServiceHistoryEndpoints
{
  public static void MapServiceHistoryEndpoints(this IEndpointRouteBuilder app)
  {
    var serviceHistory = app
      .MapGroup("/api/service-history")
      .WithTags("Service History")
      .RequireAuthorization("RequireInternalJwt"); // Only Internal JWT tokens allowed

    var _contentType = "application/json";

    serviceHistory
      .MapPost("/{vehicleId}", CreateAsync)
      .WithSummary("Create a new service history record for a vehicle")
      .Accepts<CreateServiceHistoryDetailsDto>(_contentType)
      .AddEndpointFilter<ValidationFilter<CreateServiceHistoryDetailsDto>>()
      .Produces(StatusCodes.Status201Created)
      .Produces<string>(StatusCodes.Status400BadRequest)
      .ProducesValidationProblem();

    serviceHistory
      .MapPut("/{vehicleId}/{serviceHistoryId}", UpdateAsync)
      .WithSummary("Update a service history record for a vehicle")
      .Accepts<CreateServiceHistoryDetailsDto>(_contentType)
      .AddEndpointFilter<ValidationFilter<CreateServiceHistoryDetailsDto>>()
      .Produces(StatusCodes.Status201Created)
      .Produces<string>(StatusCodes.Status400BadRequest)
      .ProducesValidationProblem();

    serviceHistory
      .MapGet("/{vehicleId}", GetAllByVehicleIdAsync)
      .WithSummary("Get all service history records for a vehicle")
      .Produces<string>(StatusCodes.Status400BadRequest)
      .Produces<List<ServiceHistoryListDto>>(StatusCodes.Status200OK);

    serviceHistory
      .MapGet("/{vehicleId}/{serviceHistoryId}", GetServiceHistoryByIdAsync)
      .WithSummary("Get a service history record by its id for a vehicle")
      .Produces<string>(StatusCodes.Status400BadRequest)
      .Produces<ServiceHistoryDetailsDto>(StatusCodes.Status200OK);

    serviceHistory
      .MapDelete("/{vehicleId}/{serviceHistoryId}", DeleteAsync)
      .WithSummary("Delete a service history record by its id for a vehicle")
      .Produces(StatusCodes.Status204NoContent);
  }

  internal static async Task<IResult> GetServiceHistoryByIdAsync(
    Guid vehicleId,
    Guid serviceHistoryId,
    ClaimsPrincipal userClaims,
    IServiceHistoryService serviceHistoryService,
    ITokenService tokenService
  )
  {
    try
    {
      var userId = tokenService.GetUserIdFromClaims(userClaims);
      var serviceHistory = await serviceHistoryService.GetServiceHistoryByIdAsync(vehicleId, serviceHistoryId, userId);
      return Results.Ok(serviceHistory);
    }
    catch (Exception ex)
    {
      return Results.BadRequest(ex.Message);
    }
  }

  internal static async Task<IResult> UpdateAsync(
    Guid vehicleId,
    Guid serviceHistoryId,
    CreateServiceHistoryDetailsDto updateServiceHistoryDetailsDto,
    ClaimsPrincipal userClaims,
    IServiceHistoryService serviceHistoryService,
    ITokenService tokenService
  )
  {
    try
    {
      var userId = tokenService.GetUserIdFromClaims(userClaims);
      await serviceHistoryService.UpdateAsync(vehicleId, serviceHistoryId, updateServiceHistoryDetailsDto, userId);
      return Results.StatusCode(StatusCodes.Status201Created);
    }
    catch (Exception ex)
    {
      return Results.BadRequest(ex.Message);
    }
  }

  internal static async Task<IResult> DeleteAsync(
    Guid vehicleId,
    Guid serviceHistoryId,
    ClaimsPrincipal userClaims,
    IServiceHistoryService serviceHistoryService,
    ITokenService tokenService
  )
  {
    try
    {
      var userId = tokenService.GetUserIdFromClaims(userClaims);
      await serviceHistoryService.DeleteAsync(vehicleId, serviceHistoryId, userId);
      return Results.NoContent();
    }
    catch (Exception ex)
    {
      return Results.BadRequest(ex.Message);
    }
  }

  internal static async Task<IResult> GetAllByVehicleIdAsync(
    ClaimsPrincipal userClaims,
    IServiceHistoryService serviceHistoryService,
    ITokenService tokenService,
    Guid vehicleId
  )
  {
    try
    {
      var userId = tokenService.GetUserIdFromClaims(userClaims);
      var vehicles = await serviceHistoryService.GetAllByVehicleIdAsync(vehicleId, userId);
      return Results.Ok(vehicles);
    }
    catch (Exception ex)
    {
      return Results.BadRequest(ex.Message);
    }
  }

  internal static async Task<IResult> CreateAsync(
    Guid vehicleId,
    ClaimsPrincipal userClaims,
    CreateServiceHistoryDetailsDto createServiceHistoryDetailsDto,
    IServiceHistoryService serviceHistoryService,
    ITokenService tokenService
  )
  {
    try
    {
      var userId = tokenService.GetUserIdFromClaims(userClaims);

      await serviceHistoryService.CreateAsync(vehicleId, createServiceHistoryDetailsDto, userId);
      return Results.StatusCode(StatusCodes.Status201Created);
    }
    catch (Exception ex)
    {
      return Results.BadRequest(ex.Message);
    }
  }
}
