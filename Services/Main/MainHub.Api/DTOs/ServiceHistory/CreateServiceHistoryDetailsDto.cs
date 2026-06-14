namespace MainHub.Api.DTOs.ServiceHistory;

/// <summary>
/// Represents a detailed info of a service history record
/// </summary>
public class CreateServiceHistoryDetailsDto
{
  /// <summary>
  /// The title of the service history entity.
  /// </summary>
  public required string Title { get; set; }

  /// <summary>
  /// The description of the service history entity.
  /// </summary>
  public required string Description { get; set; }

  /// <summary>
  /// The service history records associated with the service history entity.
  /// </summary>
  public required List<CreateServiceHistoryRecordDto> Records { get; set; } = [];
}
