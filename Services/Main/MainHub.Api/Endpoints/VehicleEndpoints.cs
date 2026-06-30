using Arex388.NhtsaVpic;
using MainHub.Api.DTOs;
using MainHub.Api.Filters;
using MainHub.Api.Services;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace MainHub.Api.Endpoints;

public static partial class VehicleEndpoints
{
  public static void MapVehicleEndpoints(this IEndpointRouteBuilder app)
  {
    var vehicles = app
      .MapGroup("/api/vehicles")
      .WithTags("Vehicles")
      .RequireAuthorization("RequireInternalJwt"); // Only Internal JWT tokens allowed

    var _contentType = "application/json";

    vehicles
      .MapPost("/", CreateAsync)
      .WithSummary("Create a new vehicle")
      .Accepts<CreateVehicleDto>(_contentType)
      .AddEndpointFilter<ValidationFilter<CreateVehicleDto>>()
      .Produces(StatusCodes.Status201Created)
      .Produces<string>(StatusCodes.Status400BadRequest)
      .ProducesValidationProblem();

    vehicles
      .MapGet("/", GetAllByUserAsync)
      .WithSummary("Get all vehicles associated with the user")
      .Produces<string>(StatusCodes.Status400BadRequest)
      .Produces<List<VehicleListItemDto>>(StatusCodes.Status200OK);

    vehicles
      .MapGet("/{vehicleId}", GetVehicleByIdAsync)
      .WithSummary("Get a vehicle by its id")
      .Produces<string>(StatusCodes.Status400BadRequest)
      .Produces<VehicleDto>(StatusCodes.Status200OK);

    vehicles
      .MapDelete("/{vehicleId}", DeleteAsync)
      .WithSummary("Delete a vehicle by its id")
      .Produces(StatusCodes.Status204NoContent);

    vehicles
      .MapGet("/vin-decode/{vin}", DecodeVinAsync)
      .WithSummary("Decode a VIN to get vehicle information")
      .Produces<string>(StatusCodes.Status400BadRequest)
      .Produces<DecodeVinResponseDto>(StatusCodes.Status200OK);

    vehicles
      .MapPut("/{vehicleId}", UpdateAsync)
      .WithSummary("Update a vehicle by its id")
      .Accepts<UpdateVehicleDto>(_contentType)
      .AddEndpointFilter<ValidationFilter<UpdateVehicleDto>>()
      .Produces(StatusCodes.Status201Created)
      .Produces<string>(StatusCodes.Status400BadRequest)
      .ProducesValidationProblem();
  }

  internal static async Task<IResult> GetVehicleByIdAsync(
    Guid vehicleId,
    ClaimsPrincipal userClaims,
    IVehicleService vehicleService,
    ITokenService tokenService,
    ILogger<Program> logger
  )
  {
    try
    {
      var userId = tokenService.GetUserIdFromClaims(userClaims);
      var vehicle = await vehicleService.GetVehicleByIdAsync(vehicleId, userId);
      return Results.Ok(vehicle);
    }
    catch (Exception ex)
    {
      return Results.BadRequest(ex.Message);
    }
  }

  internal static async Task<IResult> UpdateAsync(
    Guid vehicleId,
    UpdateVehicleDto updateVehicleDto,
    ClaimsPrincipal userClaims,
    IVehicleService vehicleService,
    ITokenService tokenService,
    ILogger<Program> logger
  )
  {
    try
    {
      var userId = tokenService.GetUserIdFromClaims(userClaims);
      await vehicleService.UpdateAsync(vehicleId, updateVehicleDto, userId);
      return Results.StatusCode(StatusCodes.Status201Created);
    }
    catch (Exception ex)
    {
      return Results.BadRequest(ex.Message);
    }
  }

  internal static async Task<IResult> DeleteAsync(
    Guid vehicleId,
    ClaimsPrincipal userClaims,
    IVehicleService vehicleService,
    ITokenService tokenService,
    ILogger<Program> logger
  )
  {
    try
    {
      var userId = tokenService.GetUserIdFromClaims(userClaims);
      await vehicleService.DeleteAsync(vehicleId, userId);
      return Results.NoContent();
    }
    catch (Exception ex)
    {
      return Results.BadRequest(ex.Message);
    }
  }

  internal static async Task<IResult> GetAllByUserAsync(
    ClaimsPrincipal userClaims,
    IVehicleService vehicleService,
    ITokenService tokenService,
    ILogger<Program> logger
  )
  {
    try
    {
      var userId = tokenService.GetUserIdFromClaims(userClaims);
      var vehicles = await vehicleService.GetAllByUserAsync(userId);
      return Results.Ok(vehicles);
    }
    catch (Exception ex)
    {
      return Results.BadRequest(ex.Message);
    }
  }

  internal static async Task<IResult> CreateAsync(
    ClaimsPrincipal userClaims,
    CreateVehicleDto createVehicleDto,
    IVehicleService vehicleService,
    ITokenService tokenService,
    ILogger<Program> logger
  )
  {
    try
    {
      var userId = tokenService.GetUserIdFromClaims(userClaims);

      await vehicleService.CreateAsync(createVehicleDto, userId);
      return Results.StatusCode(StatusCodes.Status201Created);
    }
    catch (Exception ex)
    {
      return Results.BadRequest(ex.Message);
    }
  }

  internal static async Task<IResult> DecodeVinAsync(
    string vin,
    INhtsaVpicClient client,
    ILogger<Program> logger
  )
  {
    try
    {
      var isVinValid = IsVinValid(vin);
      if (!isVinValid)
      {
        logger.LogWarning("Invalid VIN format received: {Vin}", vin);
        return Results.BadRequest("Invalid VIN format.");
      }

      var response = await client.DecodeAsync(vin, CancellationToken.None);
      logger.LogInformation("VIN Decode requested for VIN: {Vin}", response);

      if (
        response.Make is null ||
        response.Model is null ||
        response.ModelYear is null
      )
      {
        logger.LogWarning("Incomplete data {data} received for VIN: {Vin}", response.ResponseJson, vin);
        return Results.BadRequest("Incomplete data received.");
      }

      var responseDto = new DecodeVinResponseDto
      {
        Brand = response.Make,
        Model = response.Model,
        Year = response.ModelYear.Value,
      };

      return Results.Ok(responseDto);
    }
    catch (Exception)
    {
      logger.LogWarning("Decoding failed for VIN: {Vin}", vin);
      return Results.BadRequest("Decoding failed.");
    }
  }

  /// <summary>
  /// Validates if a string is a valid VIN format
  /// </summary>
  public static bool IsVinValid(string vin)
  {
    if (string.IsNullOrWhiteSpace(vin))
      return false;

    vin = vin.Trim();

    // Must be exactly 17 characters and match valid pattern
    return vin.Length == 17 && VinRegex().IsMatch(vin);
  }

  [GeneratedRegex(@"^[A-HJ-NPR-Z0-9]{17}$", RegexOptions.IgnoreCase | RegexOptions.Compiled, "en-US")]
  private static partial Regex VinRegex();
}
