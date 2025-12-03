using MainHub.Api.DTOs;
using Arex388.NhtsaVpic;
using System.Text.RegularExpressions;
using MainHub.Api.Filters;
using System.Security.Claims;
using MainHub.Api.Services;

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
      .Accepts<CreateVehicleDto>(_contentType)
      .AddEndpointFilter<ValidationFilter<CreateVehicleDto>>()
      .Produces(StatusCodes.Status201Created)
      .Produces<string>(StatusCodes.Status400BadRequest)
      .ProducesValidationProblem();

    vehicles
      .MapGet("/", GetAllByUserAsync)
      .Produces<string>(StatusCodes.Status400BadRequest)
      .Produces<List<VehicleDto>>(StatusCodes.Status200OK);

    vehicles
      .MapGet("/vin-decode/{vin}", DecodeVinAsync)
      .Produces<string>(StatusCodes.Status400BadRequest)
      .Produces<DecodeVinResponseDto>(StatusCodes.Status200OK);
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
