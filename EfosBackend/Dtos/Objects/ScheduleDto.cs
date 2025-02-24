namespace EfosBackend.Dtos.Objects;

public record ScheduleDto(string SubjectCode,int CourseCode,int Credits ,string CourseName, string Location,string Teacher, List<DayOfWeek> Days,List<TimeOnly> StartTimes,ClassType ClassType,int MissedClassesCount);