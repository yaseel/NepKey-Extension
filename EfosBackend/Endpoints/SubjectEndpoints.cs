using EfosBackend.Data;
using EfosBackend.Mapping;
using Microsoft.EntityFrameworkCore;

namespace EfosBackend.Endpoints;

public static class SubjectEndpoints
{
    public static RouteGroupBuilder MapSubjectEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/subjects").WithParameterValidation();
        group.MapGet("/", async (ApplicationDbContext dbContext) => await dbContext.Subjects.AsNoTracking().ToListAsync());

        group.MapGet("/{subjectCode}", async (ApplicationDbContext dbContext, string subjectCode) =>
        {
            var subject = await dbContext.Subjects.AsNoTracking().FirstOrDefaultAsync(sub => sub.SubjectCode == subjectCode);
            return subject==null ?  Results.NotFound() : Results.Ok(subject.ToDto());
        });
        group.MapGet("/search/{subjectCode}", async (ApplicationDbContext dbContext, string subjectCode) =>
        {
            var result = await dbContext.Subjects.AsNoTracking().
                Where(s => s.SubjectCode.Contains(subjectCode) || s.SubjectName.Contains(subjectCode)).Select(s=>s.ToDto()).ToListAsync();
            return result.Count != 0 ? Results.Ok(result.ToList()) : Results.NoContent();
        } );
        
        return group;
    }
}