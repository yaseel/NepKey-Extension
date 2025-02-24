using System.ComponentModel.DataAnnotations;

namespace EfosBackend.Entity;

public class UsersSubject
{ 
    public required string SubjectCode { get; set; }
    public required int UserId { get; set; }
}