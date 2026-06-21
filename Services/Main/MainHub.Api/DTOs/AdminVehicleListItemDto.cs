using MainHub.Api.Models;
using MainHub.Api.Shared;

namespace MainHub.Api.DTOs;

public class AdminVehicleListItemDto
{
  public required Guid Id { get; set; }
  public required Guid OwnerUserId { get; set; }
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

  public static explicit operator AdminVehicleListItemDto(
    (VehicleEntity Vehicle, Guid OwnerUserId) source
  ) =>
    new()
    {
      Id = source.Vehicle.Id,
      OwnerUserId = source.OwnerUserId,
      Brand = source.Vehicle.Brand,
      Model = source.Vehicle.Model,
      Year = source.Vehicle.Year,
      LicensePlate = source.Vehicle.LicensePlate,
      Vin = source.Vehicle.Vin,
      FuelType = source.Vehicle.FuelType,
      TransmissionType = source.Vehicle.TransmissionType,
      WheelDriveType = source.Vehicle.WheelDriveType,
      Color = source.Vehicle.Color,
      Mileage = source.Vehicle.Mileage,
      CreatedAt = source.Vehicle.CreatedAt,
    };
}
