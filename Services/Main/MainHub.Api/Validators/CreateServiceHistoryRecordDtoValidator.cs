using FluentValidation;
using MainHub.Api.DTOs.ServiceHistory;

namespace MainHub.Api.Validators;

/// <summary>
/// Validator for <see cref="CreateServiceHistoryRecordDto"/>.
/// </summary>
public class CreateServiceHistoryRecordDtoValidator : AbstractValidator<CreateServiceHistoryRecordDto>
{
  public CreateServiceHistoryRecordDtoValidator()
  {
    RuleFor(x => x.Title)
      .NotEmpty()
      .WithMessage("Title is required.")
      .MaximumLength(100)
      .WithMessage("Title must not exceed 100 characters.");

    RuleFor(x => x.Description)
      .MaximumLength(1000)
      .WithMessage("Description must not exceed 1000 characters.");

    RuleFor(x => x.Price)
      .NotEmpty()
      .WithMessage("Price is required.")
      .GreaterThan(0)
      .WithMessage("Price must be a positive value.");
  }
}