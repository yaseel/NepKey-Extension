using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace EfosBackend.Entity;

public class User : IdentityUser<int>
{
    public string? EncryptedOtpCode { get; set;}
}