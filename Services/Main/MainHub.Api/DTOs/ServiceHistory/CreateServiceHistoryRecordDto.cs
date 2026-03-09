namespace MainHub.Api.DTOs.ServiceHistory;

/// <summary>
/// Represents a detailed info of a service history record
/// </summary>
public class CreateServiceHistoryRecordDto
{
  /// <summary>
  /// The title of the service history record.
  /// </summary>
  public required string Title { get; set; }

  /// <summary>
  /// The description of the service history dto.
  /// </summary>
  public required string Description { get; set; }

  /// <summary>
  /// The price of the service history record.
  /// </summary>
  public required int Price { get; set; }
}
