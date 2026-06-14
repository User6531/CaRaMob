namespace MainHub.Api.DTOs.ServiceHistory;

/// <summary>
/// Represents a detailed info of a service history record
/// </summary>
public class ServiceHistoryDetailsDto
{
  /// <summary>
  /// The unique identifier for the service history entity.
  /// </summary>
  public required Guid Id { get; set; }

  /// <summary>
  /// The title of the service history dto.
  /// </summary>
  public required string Title { get; set; }

  /// <summary>
  /// The date and time when the service history entity was created.
  /// </summary>
  public required DateTime CreatedAt { get; set; }

  /// <summary>
  /// The date and time when the service history entity was updated.
  /// </summary>
  public required DateTime? UpdatedAt { get; set; }

  /// <summary>
  /// The description of the service history dto.
  /// </summary>
  public required string Description { get; set; }

  /// <summary>
  /// The service history records associated with the service history entity.
  /// </summary>
  public required List<ServiceHistoryRecordDto> Records { get; set; } = [];
}
