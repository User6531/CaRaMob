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

    RuleFor(x => x.Description)
      .NotEmpty()
      .WithMessage("Description is required.")
      .MaximumLength(1000)
      .WithMessage("Description must not exceed 1000 characters.");

    RuleFor(x => x.Records)
      .NotEmpty()
      .WithMessage("Records are required.");

    RuleForEach(x => x.Records).SetValidator(new CreateServiceHistoryRecordDtoValidator());
  }
}