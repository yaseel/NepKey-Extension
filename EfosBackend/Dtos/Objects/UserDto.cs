
namespace EfosBackend.Dtos.Objects;

public record UserDto(string AccountId,string Email,string HashedPassword,string EncryptedNeptunCode,string HashedNeptunPassword);