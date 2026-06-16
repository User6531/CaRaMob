using MainHub.Api.Shared;

namespace MainHub.Api.DTOs;

public class AdminVehicleQueryDto
{
  public string? Brand { get; set; }
  public string? Model { get; set; }
  public string? Vin { get; set; }
  public string? LicensePlate { get; set; }
  public string? Color { get; set; }
  public FuelType? FuelType { get; set; }
  public TransmissionType? TransmissionType { get; set; }
  public WheelDriveType? WheelDriveType { get; set; }
  public int? YearFrom { get; set; }
  public int? YearTo { get; set; }
  public int Page { get; set; } = 1;
  public int PageSize { get; set; } = 20;
}
