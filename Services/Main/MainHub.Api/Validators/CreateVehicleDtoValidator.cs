using System.Text.RegularExpressions;
using FluentValidation;
using MainHub.Api.DTOs;
using MainHub.Api.Shared;

namespace MainHub.Api.Validators;

/// <summary>
/// Validator for <see cref="CreateVehicleDto"/>.
/// </summary>
public class CreateVehicleDtoValidator : AbstractValidator<CreateVehicleDto>
{
  public CreateVehicleDtoValidator()
  {
    RuleFor(x => x.LicensePlate)
      .NotEmpty()
      .WithMessage("License plate is required.")
      .MaximumLength(10)
      .WithMessage("License plate must not exceed 10 characters.");

    RuleFor(x => x.Vin)
      .NotEmpty()
      .WithMessage("Vin is required.")
      .MinimumLength(17)
      .WithMessage("Vin must be 17 characters long.")
      .MaximumLength(17)
      .WithMessage("Vin must not exceed 17 characters.")
      .Matches(@"^[A-HJ-NPR-Z0-9]{17}$", RegexOptions.IgnoreCase | RegexOptions.Compiled)
      .WithMessage("Vin must be a valid 17-character VIN.");

    RuleFor(x => x.Year)
      .NotEmpty()
      .WithMessage("Year created is required.")
      .GreaterThanOrEqualTo(1900)
      .WithMessage("Year created must be greater than or equal to 1900.")
      .LessThanOrEqualTo(DateTime.UtcNow.Year)
      .WithMessage("Year created must be less than or equal to the current year.");

    RuleFor(x => x.Color)
      .NotEmpty()
      .WithMessage("Color is required.")
      .MaximumLength(50)
      .WithMessage("Color must not exceed 50 characters.");

    RuleFor(x => x.Brand)
      .NotEmpty()
      .WithMessage("Brand is required.")
      .MaximumLength(50)
      .WithMessage("Brand must not exceed 50 characters.");

    RuleFor(x => x.Model)
      .NotEmpty()
      .WithMessage("Model is required.")
      .MaximumLength(50)
      .WithMessage("Model must not exceed 50 characters.");

    RuleFor(x => x.BoughtAt)
      .LessThanOrEqualTo(DateTime.UtcNow)
      .WithMessage("Bought date cannot be in the future.")
      .When(x => x.BoughtAt.HasValue);

    RuleFor(x => x.EngineCapacity)
    .NotEmpty().WithMessage("Engine capacity is required.")
    .LessThanOrEqualTo(10000).WithMessage("Engine capacity must be less than or equal to 10000.")
    .GreaterThan(0).WithMessage("Engine capacity must be greater than 0.")
        .When(x => x.FuelType is not FuelType.Electric and not FuelType.Hydrogen)
    .Equal(0).WithMessage("Engine capacity must be 0 for Electric/Hydrogen vehicles.")
        .When(x => x.FuelType is FuelType.Electric or FuelType.Hydrogen);

    RuleFor(x => x.Mileage)
      .NotEmpty()
      .WithMessage("Mileage is required.")
      .GreaterThanOrEqualTo(0)
      .WithMessage("Mileage cannot be negative.")
      .LessThanOrEqualTo(1000000)
      .WithMessage("Mileage must be less than or equal to 1,000,000.");

    RuleFor(x => x.PhotoUrl)
      .MaximumLength(200)
      .WithMessage("Photo URL must not exceed 200 characters.")
      .When(x => x.PhotoUrl?.Length > 0)

      .Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute))
      .WithMessage("Photo URL must be a valid URL.")
      .When(x => x.PhotoUrl?.Length > 0);

    RuleFor(x => x.EnginePower)
      .NotEmpty()
      .WithMessage("Engine power is required.")
      .GreaterThan(0)
      .WithMessage("Engine power must be greater than 0.")
      .LessThanOrEqualTo(1000)
      .WithMessage("Engine power must be less than or equal to 1000.");

    RuleFor(x => x.TransmissionType)
      .IsInEnum()
      .WithMessage("Transmission type must be a valid transmission type.");

    RuleFor(x => x.FuelType)
      .IsInEnum()
      .WithMessage("Fuel type must be a valid fuel type.");

    RuleFor(x => x.WheelDriveType)
      .IsInEnum()
      .WithMessage("Wheel drive type must be a valid wheel drive type.");
  }
}

