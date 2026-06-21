namespace MainHub.Api.DTOs;

public class AdminServiceHistoryVisitDto
{
  public required Guid Id { get; set; }
  public required Guid VehicleId { get; set; }
  public required string Title { get; set; }
  public required string Description { get; set; }
  public required DateTime CreatedAt { get; set; }
  public required DateTime? UpdatedAt { get; set; }
}
