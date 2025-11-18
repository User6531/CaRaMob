using FluentValidation;

namespace MainHub.Api.Filters;

/// <summary>
/// Provides methods to validate data input on HTTP calls.
/// </summary>
/// <typeparam name="T">The type of the DTO to validate.</typeparam>
public class ValidationFilter<T> : IEndpointFilter where T : class
{
  private readonly IValidator<T> _validator;

  /// <summary>
  /// Constructor that is called when performing AddEndpointFilter.
  /// </summary>
  /// <param name="validator">The FluentValidation validator for type T.</param>
  public ValidationFilter(IValidator<T> validator)
  {
    _validator = validator;
  }

  /// <inheritdoc/>
  public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
  {
    // This happens before the endpoint call
    var validatable = context.Arguments.SingleOrDefault(x => x?.GetType() == typeof(T)) as T;

    if (validatable is null)
    {
      return Results.Problem(
        detail: $"Expected parameter of type {typeof(T).Name} was not found.",
        statusCode: StatusCodes.Status400BadRequest
      );
    }

    var validationResult = await _validator.ValidateAsync(validatable);

    if (!validationResult.IsValid)
    {
      // Return validation errors in the standard ASP.NET Core format
      var errors = validationResult.Errors
        .GroupBy(e => e.PropertyName)
        .ToDictionary(
          g => g.Key,
          g => g.Select(e => e.ErrorMessage).ToArray()
        );

      return Results.ValidationProblem(errors);
    }

    return await next(context);
  }
}

