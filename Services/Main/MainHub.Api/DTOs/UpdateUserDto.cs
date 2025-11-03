namespace MainHub.Api.DTOs
{
  /// <summary>
  /// Represents an update user DTO.
  /// </summary>
  public class UpdateUserDto
  {
    /// <summary>
    /// The name of the user.
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    /// The email of the user.
    /// </summary>
    public string? Email { get; set; }
  }
}
