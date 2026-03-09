namespace MainHub.Api.Models;

/// <summary>
/// Represents a service history record.
/// </summary>
public class ServiceHistoryRecordModel
{
  /// <summary>
  /// Gets or sets the unique identifier for the service history record.
  /// </summary>
  public required Guid Id { get; set; }

  /// <summary>
  /// Gets or sets the title of the service history record.
  /// </summary>
  public required string Title { get; set; }

  /// <summary>
  /// Gets or sets the price of the service history record.
  /// </summary>
  public required int Price { get; set; }
}
