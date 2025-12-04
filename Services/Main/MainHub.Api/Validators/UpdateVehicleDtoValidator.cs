using FluentValidation;
using MainHub.Api.DTOs;

namespace MainHub.Api.Validators;

/// <summary>
/// Validator for <see cref="UpdateVehicleDto"/>.
/// </summary>
public class UpdateVehicleDtoValidator : AbstractValidator<UpdateVehicleDto>
{
  public UpdateVehicleDtoValidator()
  {
    RuleFor(x => x.LicensePlate)
      .NotEmpty()
      .WithMessage("License plate is required.")
      .MaximumLength(10)
      .WithMessage("License plate must not exceed 10 characters.");

    RuleFor(x => x.Color)
      .NotEmpty()
      .WithMessage("Color is required.")
      .MaximumLength(50)
      .WithMessage("Color must not exceed 50 characters.");

    RuleFor(x => x.BoughtAt)
      .LessThanOrEqualTo(DateTime.UtcNow)
      .WithMessage("Bought date cannot be in the future.")
      .When(x => x.BoughtAt.HasValue);

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
  }
}

