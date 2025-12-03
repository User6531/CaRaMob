using MainHub.Api.Repositories;
using MainHub.Api.DTOs;
using MainHub.Api.Models;

namespace MainHub.Api.Services;

/// <summary>
/// Defines methods for managing vehicle entities.
/// </summary>
public interface IVehicleService
{
  /// <summary>
  /// Creates a new vehicle asynchronously.
  /// </summary>
  Task CreateAsync(CreateVehicleDto createVehicleDto, Guid userId);

  /// <summary>
  /// Retrieves all vehicles associated with a user asynchronously.
  /// </summary>
  /// <param name="userId">The unique identifier of the user.</param>
  Task<List<VehicleDto>> GetAllByUserAsync(Guid userId);
}

public class VehicleService(
  IVehicleRepository repository,
  IUserService userService
) : IVehicleService
{
  private readonly IVehicleRepository _repository = repository;
  private readonly IUserService _userService = userService;

  public async Task<List<VehicleDto>> GetAllByUserAsync(Guid userId)
  {
    var user = await _userService.GetByIdAsync(userId);

    if (user == null)
    {
      throw new ArgumentException("User not found.", nameof(userId));
    }

    if (user.VehicleIds == null || user.VehicleIds.Count == 0)
    {
      return [];
    }

    var vehicleEntities = await _repository.GetByIdsAsync(user.VehicleIds);
    var vehicles = vehicleEntities.Select(v => new VehicleDto
    {
      Vin = v.Vin,
    }).ToList();

    return vehicles;
  }

  public async Task CreateAsync(CreateVehicleDto createVehicleDto, Guid userId)
  {
    var vehicle = new VehicleEntity
    {
      Id = Guid.NewGuid(),
      Vin = createVehicleDto.Vin,
      Model = createVehicleDto.Model,
      UpdatedAt = null,
      CreatedAt = DateTime.UtcNow,
      BoughtAt = createVehicleDto.BoughtAt,
      Color = createVehicleDto.Color,
      LicensePlate = createVehicleDto.LicensePlate,
      Brand = createVehicleDto.Brand,
      EngineCapacity = createVehicleDto.EngineCapacity,
      EnginePower = createVehicleDto.EnginePower,
      FuelType = createVehicleDto.FuelType,
      TransmissionType = createVehicleDto.TransmissionType,
      Mileage = createVehicleDto.Mileage,
      WheelDriveType = createVehicleDto.WheelDriveType,
      Year = createVehicleDto.Year,
    };

    var isExist = await _repository.VinExistsAsync(vehicle.Vin);
    if (isExist)
    {
      throw new ArgumentException("A vehicle with the same VIN already exists.", nameof(createVehicleDto.Vin));
    }

    await _repository.CreateAsync(vehicle);
    await _userService.AttachVehicleAsync(vehicle.Id, userId);
  }
}
