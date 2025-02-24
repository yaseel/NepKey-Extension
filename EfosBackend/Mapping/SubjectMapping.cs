using EfosBackend.Dtos.Objects;
using EfosBackend.Entity;
using EfosBackend.Dtos;

namespace EfosBackend.Mapping;

public static class SubjectMapping
{
    public static SubjectsDto ToDto(this Subject subject)
    {
        SubjectsDto newSubject = new SubjectsDto(subject.SubjectCode,subject.Credits,subject.SubjectName);
        return newSubject;
    }
}