using MainHub.Api.Models;
using MainHub.Api.Shared;

namespace MainHub.Api.DTOs;

public class AdminVehicleListItemDto
{
  public required Guid Id { get; set; }
  public Guid? OwnerUserId { get; set; }
  public required string Brand { get; set; }
  public required string Model { get; set; }
  public required int Year { get; set; }
  public required string LicensePlate { get; set; }
  public required string Vin { get; set; }
  public required FuelType FuelType { get; set; }
  public required TransmissionType TransmissionType { get; set; }
  public required WheelDriveType WheelDriveType { get; set; }
  public required string Color { get; set; }
  public required int Mileage { get; set; }
  public required DateTime CreatedAt { get; set; }
}

public static class AdminVehicleListItemDtoMapper
{
  public static AdminVehicleListItemDto ToAdminVehicleListItemDto(
    this VehicleEntity vehicle,
    Guid? ownerUserId = null
  )
  {
    return new AdminVehicleListItemDto
    {
      Id = vehicle.Id,
      OwnerUserId = ownerUserId,
      Brand = vehicle.Brand,
      Model = vehicle.Model,
      Year = vehicle.Year,
      LicensePlate = vehicle.LicensePlate,
      Vin = vehicle.Vin,
      FuelType = vehicle.FuelType,
      TransmissionType = vehicle.TransmissionType,
      WheelDriveType = vehicle.WheelDriveType,
      Color = vehicle.Color,
      Mileage = vehicle.Mileage,
      CreatedAt = vehicle.CreatedAt
    };
  }
}
