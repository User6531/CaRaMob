using FluentValidation;
using MainHub.Api.DTOs.ServiceHistory;

namespace MainHub.Api.Validators;

/// <summary>
/// Validator for <see cref="CreateServiceHistoryDetailsDto"/>.
/// </summary>
public class CreateServiceHistoryDetailsDtoValidator : AbstractValidator<CreateServiceHistoryDetailsDto>
{
  public CreateServiceHistoryDetailsDtoValidator()
  {
    RuleFor(x => x.Title)
      .NotEmpty()
      .WithMessage("Title is required.")
      .MaximumLength(100)
      .WithMessage("Title must not exceed 100 characters.");

    RuleFor(x => x.Records)
      .NotEmpty()
      .WithMessage("Records are required.")
      .Must(records => records.Count > 0)
      .WithMessage("At least one record is required.");

    RuleFor(x => x.Description)
      .NotEmpty()
      .WithMessage("Description is required.")
      .MaximumLength(500)
      .WithMessage("Description must not exceed 500 characters.");

    RuleForEach(x => x.Records).SetValidator(new CreateServiceHistoryRecordDtoValidator());
  }
}