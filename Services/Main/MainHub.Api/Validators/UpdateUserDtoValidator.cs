using FluentValidation;
using MainHub.Api.DTOs;

namespace MainHub.Api.Validators;

/// <summary>
/// Validator for <see cref="UpdateUserDto"/>.
/// </summary>
public class UpdateUserDtoValidator : AbstractValidator<UpdateUserDto>
{
  public UpdateUserDtoValidator()
  {
    RuleFor(x => x.Name)
      .MaximumLength(100)
      .WithMessage("Name must not exceed 100 characters.")
      .When(x => x.Name is not null);

    RuleFor(x => x.Email)
      .EmailAddress()
      .WithMessage("Email must be a valid email address.")
      .MaximumLength(255)
      .WithMessage("Email must not exceed 255 characters.")
      .When(x => x.Email is not null);
  }
}

