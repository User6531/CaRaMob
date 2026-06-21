namespace MainHub.Api.DTOs;

public class PagedResultDto<TItem>
{
  public required IReadOnlyList<TItem> Items { get; set; }
  public required int TotalItems { get; set; }
}
