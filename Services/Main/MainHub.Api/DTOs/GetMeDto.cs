namespace MainHub.Api.DTOs;

/// <summary>
/// Represents a data transfer object for retrieving the current user's information.
/// </summary>
public class GetMeDto
{
  /// <summary>
  /// Represent if the user is registered in the system.
  /// </summary>
  public required bool IsRegistered { get; set; }

  /// <summary>
  /// Represents the user's information if registered and null otherwise.
  /// </summary>
  public required UserInfo? UserData { get; set; }
}

/// <summary>
/// Represents user information details.
/// </summary>
public class UserInfo
{
  /// <summary>
  /// Represents the name of the user.
  /// </summary>
  public required string Name { get; set; }
}