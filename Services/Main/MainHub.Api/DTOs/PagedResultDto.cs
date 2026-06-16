namespace MainHub.Api.DTOs;

public class PagedResultDto<TItem>
{
  public required IReadOnlyList<TItem> Items { get; set; }
  public required int Page { get; set; }
  public required int PageSize { get; set; }
  public required int TotalItems { get; set; }
  public required int TotalPages { get; set; }
}
