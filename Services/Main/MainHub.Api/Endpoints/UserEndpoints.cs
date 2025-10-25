using MainHub.Api.Services;
using MainHub.Api.DTOs;
using System.Security.Claims;

namespace MainHub.Api.Endpoints;

public static class UserEndpoints
{
  public static void MapUserEndpoints(this IEndpointRouteBuilder app)
  {
    var users = app.MapGroup("/api/users")
                   .WithTags("Users")
                   .RequireAuthorization();

    // users.MapGet("/", GetAllAsync);

    // users.MapGet("/{id:guid}", GetByIdAsync);

    // users.MapDelete("/{id:guid}", DeleteAsync);

    users.MapPost("/", CreateAsync);

    users.MapPut("/update", UpdateAsync);

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
    var providerId = userClaims.FindFirstValue(ClaimTypes.NameIdentifier);
    var email = userClaims.FindFirst("preferred_username")?.Value;
    var name = userClaims.FindFirst("name")?.Value;
    logger.LogInformation("GetMe called by user: {Name}, Email: {Email}, ProviderId: {ProviderId}", name, email, providerId);

    if (string.IsNullOrEmpty(providerId))
    {
      logger.LogWarning("GetMe failed: ProviderId (oid) claim is missing");
      return Results.BadRequest("ProviderId (oid) claim is missing.");
    }

    var getMeData = await userService.GetMeAsync(providerId);
    return Results.Ok(getMeData);
  }
  internal static async Task<IResult> GetAllAsync(IUserService userService)
  {
    var allUsers = await userService.GetAllAsync();
    return Results.Ok(allUsers);
  }

  internal static async Task<IResult> GetByIdAsync(
    Guid id,
    IUserService userService
  )
  {
    var user = await userService.GetByIdAsync(id);
    return user is null ? Results.NotFound() : Results.Ok(user);
  }

  internal static async Task<IResult> CreateAsync(
    CreateUserDto userDto,
    IUserService userService,
    ClaimsPrincipal userClaims,
    ILogger<Program> logger
  )
  {
    var providerId = userClaims.FindFirstValue(ClaimTypes.NameIdentifier);
    var email = userClaims.FindFirst("preferred_username")?.Value;
    var name = userClaims.FindFirst("name")?.Value;
    logger.LogInformation("Create internal user called by user: {Name}, Email: {Email}, ProviderId: {ProviderId}", name, email, providerId);

    if (string.IsNullOrEmpty(providerId))
    {
      logger.LogWarning("Create internal user failed: ProviderId (oid) claim is missing");
      return Results.BadRequest("ProviderId (oid) claim is missing.");
    }

    await userService.CreateAsync(userDto, providerId);
    return Results.Created();
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
