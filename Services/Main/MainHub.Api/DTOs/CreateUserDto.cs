namespace MainHub.Api.DTOs
{
  /// <summary>
  /// Represents a user entity in the MainHub API.
  /// </summary>
  public class CreateUserDto
  {
    /// <summary>
    /// The name of the user.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// The email of the user.
    /// </summary>
    public string? Email { get; set; }
  }
}
