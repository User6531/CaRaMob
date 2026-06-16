namespace MainHub.Api.DTOs;

public class AdminDriverQueryDto
{
  public string? Name { get; set; }
  public string? Email { get; set; }
  public string? Phone { get; set; }
  public string? ProviderId { get; set; }
  public DateTime? CreatedFrom { get; set; }
  public DateTime? CreatedTo { get; set; }
  public int Page { get; set; } = 1;
  public int PageSize { get; set; } = 20;
}
