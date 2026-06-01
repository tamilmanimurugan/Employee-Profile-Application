using EmployeeProfile.Api.Models;

namespace EmployeeProfile.Api.Data;

/// <summary>
/// Seeds the database with the 14 default employees on first run.
/// Runs only when the Employees table is empty.
/// </summary>
public static class SeedData
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Skip if data already exists
        if (context.Employees.Any()) return;

        var employees = new List<Employee>
        {
            new() { Name = "Tamilmani",  Email = "tamil@gmail.com",    Department = "Development", Role = "Angular Developer",    Experience = "5 Years",  Status = "Active",   Performance = 90, Image = "https://i.pravatar.cc/100?img=12" },
            new() { Name = "Rahul",      Email = "rahul@gmail.com",    Department = "Backend",     Role = ".NET Developer",       Experience = "4 Years",  Status = "On Leave", Performance = 80, Image = "https://i.pravatar.cc/100?img=18" },
            new() { Name = "Priya",      Email = "priya@gmail.com",    Department = "UI/UX",       Role = "UI Designer",          Experience = "3 Years",  Status = "Active",   Performance = 88, Image = "https://i.pravatar.cc/100?img=32" },
            new() { Name = "Karthika",   Email = "karthika@gmail.com", Department = "Testing",     Role = "QA Engineer",          Experience = "6 Years",  Status = "Active",   Performance = 92, Image = "https://i.pravatar.cc/100?img=45" },
            new() { Name = "Sneha",      Email = "sneha@gmail.com",    Department = "HR",          Role = "HR Manager",           Experience = "7 Years",  Status = "On Leave", Performance = 75, Image = "https://i.pravatar.cc/100?img=25" },
            new() { Name = "Arun",       Email = "arun@gmail.com",     Department = "Support",     Role = "Support Engineer",     Experience = "2 Years",  Status = "Active",   Performance = 70, Image = "https://i.pravatar.cc/100?img=60" },
            new() { Name = "Divya",      Email = "divya@gmail.com",    Department = "Development", Role = "Frontend Developer",   Experience = "4 Years",  Status = "Active",   Performance = 95, Image = "https://i.pravatar.cc/100?img=15" },
            new() { Name = "Vijay",      Email = "vijay@gmail.com",    Department = "Marketing",   Role = "Marketing Lead",       Experience = "5 Years",  Status = "Active",   Performance = 82, Image = "https://i.pravatar.cc/100?img=68" },
            new() { Name = "Meena",      Email = "meena@gmail.com",    Department = "Finance",     Role = "Accountant",           Experience = "8 Years",  Status = "On Leave", Performance = 78, Image = "https://i.pravatar.cc/100?img=49" },
            new() { Name = "Siva",       Email = "siva@gmail.com",     Department = "Security",    Role = "Security Analyst",     Experience = "5 Years",  Status = "Active",   Performance = 85, Image = "https://i.pravatar.cc/100?img=53" },
            new() { Name = "Lakshmi",    Email = "lakshmi@gmail.com",  Department = "Development", Role = "React Developer",      Experience = "3 Years",  Status = "Active",   Performance = 87, Image = "https://i.pravatar.cc/100?img=44" },
            new() { Name = "Suresh",     Email = "suresh@gmail.com",   Department = "Backend",     Role = "Java Developer",       Experience = "6 Years",  Status = "Active",   Performance = 91, Image = "https://i.pravatar.cc/100?img=57" },
            new() { Name = "Anitha",     Email = "anitha@gmail.com",   Department = "Testing",     Role = "Automation Engineer",  Experience = "4 Years",  Status = "Active",   Performance = 83, Image = "https://i.pravatar.cc/100?img=33" },
            new() { Name = "Ravi",       Email = "ravi@gmail.com",     Department = "DevOps",      Role = "DevOps Engineer",      Experience = "5 Years",  Status = "On Leave", Performance = 88, Image = "https://i.pravatar.cc/100?img=61" },
        };

        var now = DateTime.UtcNow;
        employees.ForEach(e => e.CreatedAtUtc = now);

        await context.Employees.AddRangeAsync(employees);
        await context.SaveChangesAsync();
    }
}
