namespace MainHub.Api.DTOs;

public class RefreshTokenResponseDto
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}
