namespace MainHub.Api.Shared;

public static class PaginationHelper
{
  public static (int Page, int PageSize, int Skip) Normalize(int page, int pageSize)
  {
    var safePage = page <= 0 ? 1 : page;
    var safePageSize = pageSize <= 0 ? 20 : Math.Min(pageSize, 100);
    var skip = (safePage - 1) * safePageSize;

    return (safePage, safePageSize, skip);
  }
}
