namespace EmployeeProfile.Api.Models;

public class Employee
{
    public int    Id          { get; set; }
    public string Name        { get; set; } = string.Empty;
    public string Email       { get; set; } = string.Empty;
    public string Department  { get; set; } = string.Empty;
    public string Role        { get; set; } = string.Empty;
    public string Experience  { get; set; } = string.Empty;
    public string Status      { get; set; } = "Active";
    public int    Performance { get; set; } = 80;
    public string Image       { get; set; } = string.Empty;

    // Match the existing SQL Server column names exactly
    public DateTime  CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
}
