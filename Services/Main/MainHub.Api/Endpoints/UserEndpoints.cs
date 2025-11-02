using MainHub.Api.Services;
using MainHub.Api.DTOs;
using System.Security.Claims;

namespace MainHub.Api.Endpoints;

public static class UserEndpoints
{
  public static void MapUserEndpoints(this IEndpointRouteBuilder app)
  {
    var users = app.MapGroup("/api/user")
                   .WithTags("User")
                   .RequireAuthorization("RequireInternalJwt"); // Only Internal JWT tokens allowed

    users.MapPut("/update", UpdateAsync)
      .Produces(StatusCodes.Status204NoContent);

    users
      .MapGet("/me", GetMeAsync)
      .Produces<GetMeDto>(StatusCodes.Status200OK);
  }

  internal static async Task<IResult> UpdateAsync(
    UpdateUserDto userDto,
    IUserService userService
  )
  {
    await userService.UpdateAsync(userDto);
    return Results.NoContent();
  }

  internal static async Task<IResult> GetMeAsync(
    ClaimsPrincipal userClaims,
    IUserService userService,
    ILogger<Program> logger
  )
  {
    // Internal JWT tokens have userId in NameIdentifier claim
    var userIdClaim = userClaims.FindFirstValue(ClaimTypes.NameIdentifier);
    var userIdFromCustomClaim = userClaims.FindFirstValue("userId");

    var userIdString = userIdClaim ?? userIdFromCustomClaim;

    if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
    {
      logger.LogWarning("GetMe failed: UserId claim is missing or invalid");
      return Results.BadRequest("UserId claim is missing or invalid.");
    }

    logger.LogInformation("GetMe called by userId: {UserId}", userId);

    var getMeData = await userService.GetMeByUserIdAsync(userId);
    return Results.Ok(getMeData);
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
