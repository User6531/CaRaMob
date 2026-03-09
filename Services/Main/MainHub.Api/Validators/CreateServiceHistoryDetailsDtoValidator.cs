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

    RuleForEach(x => x.Records).SetValidator(new CreateServiceHistoryRecordDtoValidator());
  }
}