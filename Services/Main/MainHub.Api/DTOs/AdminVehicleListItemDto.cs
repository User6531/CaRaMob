using MainHub.Api.Models;
using MainHub.Api.Shared;

namespace MainHub.Api.DTOs;

public class AdminVehicleListItemDto : VehicleListItemDto
{
  public required Guid OwnerUserId { get; set; }

}
