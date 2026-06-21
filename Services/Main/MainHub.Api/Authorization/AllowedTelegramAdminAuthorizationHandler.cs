using MainHub.Api.Config;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace MainHub.Api.Authorization;

public sealed class AllowedTelegramAdminAuthorizationHandler(
  IOptions<AdminSettings> adminSettings
) : AuthorizationHandler<AllowedTelegramAdminRequirement>
{
  protected override Task HandleRequirementAsync(
    AuthorizationHandlerContext context,
    AllowedTelegramAdminRequirement requirement
  )
  {
    var userId = context.User.FindFirst("userId")?.Value;
    var allowedTelegramIds = adminSettings.Value.AllowedTelegramIds ?? [];

    if (
      !string.IsNullOrWhiteSpace(userId) &&
      allowedTelegramIds.Contains(userId)
    )
    {
      context.Succeed(requirement);
    }

    return Task.CompletedTask;
  }
}
