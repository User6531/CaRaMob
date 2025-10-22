using MainHub.Api.Services;
using MainHub.Api.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

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
    users.MapPost("/", CreateAsync);
    // users.MapDelete("/{id:guid}", DeleteAsync);
    users.MapGet("/me", [Authorize] async (ClaimsPrincipal user, IUserService userService, ILogger<Program> logger) =>
    {
      var providerId = user.FindFirst("oid")?.Value;
      var email = user.FindFirst("preferred_username")?.Value;
      var name = user.FindFirst("name")?.Value;
      logger.LogInformation("GetMe called by user: {Name}, Email: {Email}, ProviderId: {ProviderId}", name, email, providerId);

      if (string.IsNullOrEmpty(providerId))
      {
        logger.LogWarning("GetMe failed: ProviderId (oid) claim is missing");
        return Results.BadRequest("ProviderId (oid) claim is missing.");
      }

      var getMeData = await userService.GetMeAsync(providerId);
      return Results.Ok(getMeData);
    })
    .Produces<GetMeDto>(StatusCodes.Status200OK);

    // deploymentsPerIntuneConnection.MapPost($"{{tenantId:Guid}}/draft", CreateDraftDeployment)
    //     .WithName()
    // .WithMetadata();
    //  .Accepts<CreateDraftIntuneDeploymentDto>(_contentType)
    //   .Produces<DraftIntuneDeploymentDto>(StatusCodes.Status200OK)
    //   .Produces(StatusCodes.Status400BadRequest)
    //   .Produces(StatusCodes.Status404NotFound)
    //   .AddEndpointFilter<ValidationFilter<CreateDraftIntuneDeploymentDto>>()
    //   .MapToApiVersion(1, 1)
    //   .MapToApiVersion(1, 0)
    //   .RequireAuthorization(PmpcAuthPolicy.DeploymentsWrite);
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
    ClaimsPrincipal userСlaims,
    ILogger<Program> logger
  )
  {
    var providerId = userСlaims.FindFirst("oid")?.Value;
    var email = userСlaims.FindFirst("preferred_username")?.Value;
    var name = userСlaims.FindFirst("name")?.Value;
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
