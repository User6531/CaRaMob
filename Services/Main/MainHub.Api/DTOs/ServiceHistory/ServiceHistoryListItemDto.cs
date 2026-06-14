namespace MainHub.Api.DTOs.ServiceHistory;

/// <summary>
/// Represent a service history list DTO.
/// </summary>
public class ServiceHistoryListItemDto
{
  /// <summary>
  /// The unique identifier for the service history entity.
  /// </summary>
  public required Guid Id { get; set; }

  /// <summary>
  /// The name of the user.
  /// </summary>
  public required string Title { get; set; }

  /// <summary>
  /// The date and time when the service history entity was created.
  /// </summary>
  public required DateTime CreatedAt { get; set; }

  /// <summary>
  /// The first 4 service history records associated with the service history entity.
  /// </summary>
  public required List<ServiceHistoryRecordDto> Records { get; set; } = [];
}
