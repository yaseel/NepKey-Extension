namespace EfosBackend.Dtos.Authorization;

public record ResetPasswordDto(string Email, string NewPassword,string Token);