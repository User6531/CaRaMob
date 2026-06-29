namespace MainHub.Api.Shared;

public static class PaginationHelper
{
  public static (int Skip, int Limit) Normalize(int page, int pageSize)
  {
    var limit = page <= 0 ? 1 : page;
    var safePageSize = pageSize <= 0 ? 20 : Math.Min(pageSize, 100);
    var skip = (limit - 1) * safePageSize;

    return (skip, limit);
  }
}
