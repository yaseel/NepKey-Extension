using EfosBackend.Data;
using EfosBackend.Dtos.Objects;
using EfosBackend.Entity;
using EfosBackend.Dtos;
using EfosBackend.Mapping;
using Microsoft.EntityFrameworkCore;

namespace EfosBackend.Endpoints;

public static class UserSubjectEndpoints
{
    public static RouteGroupBuilder MapUserSubjectsEndpoint(this WebApplication app)
    {
        var group = app.MapGroup("/user-subjects").WithParameterValidation();

        group.MapGet("/{userId}", async (ApplicationDbContext dbContext,int userId) =>
        {
             var codes = await dbContext.UserSubjects.Where(us=>us.UserId==userId).Select(us=>us.SubjectCode).AsNoTracking().ToListAsync();
             var res = await dbContext.Subjects.Where(s=>codes.Contains(s.SubjectCode)).AsNoTracking().ToListAsync();
             List<SubjectsDto> subjectsDtos = new List<SubjectsDto>();
             foreach (var subject in res)
                 subjectsDtos.Add(subject.ToDto());
             return Results.Ok(subjectsDtos);
        });

        group.MapDelete("/{userId}/{subjectCode}", async (ApplicationDbContext dbContext, int userId ,string subjectCode) =>
        {
            await dbContext.UserSubjects.
                Where(us => us.UserId == userId && us.SubjectCode == subjectCode)
                .ExecuteDeleteAsync();
            return Results.NoContent();
        });
        
        // Add subject to user
        group.MapPost("/{userId}/{subjectCode}", 
            async (int userId, string subjectCode, ApplicationDbContext dbContext) =>
            {
                var userExists = await dbContext.Users.AnyAsync(user => user.Id == userId);
                var subjectExists = await dbContext.Subjects.AnyAsync(s => s.SubjectCode == subjectCode);
                var userHasSubject = await dbContext.UserSubjects.AnyAsync(us => us.SubjectCode == subjectCode);
                if (!userExists || !subjectExists)
                {
                    return Results.NotFound("Subject or user not found");
                }
                if (userHasSubject)
                    return Results.Conflict(new { message = "User already has this subject." });

                var userSubject = new UsersSubject{UserId = userId, SubjectCode = subjectCode};
                await dbContext.UserSubjects.AddAsync(userSubject);
                await dbContext.SaveChangesAsync();
                
                return Results.Created($"/user-subjects/{userId}/{subjectCode}", userSubject);
            });
        
        return group;
    }
}