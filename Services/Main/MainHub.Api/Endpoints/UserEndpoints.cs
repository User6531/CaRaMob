using MainHub.Api.DTOs;
using MainHub.Api.Filters;
using MainHub.Api.Services;
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
}
