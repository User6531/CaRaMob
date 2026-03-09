namespace MainHub.Api.DTOs.ServiceHistory;

/// <summary>
/// Represent a service history list DTO.
/// </summary>
public class ServiceHistoryListDto
{
  /// <summary>
  /// The List of service history items.
  /// </summary>
  public required List<ServiceHistoryListItemDto> Items { get; set; }
}
