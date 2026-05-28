using System.ComponentModel.DataAnnotations;

namespace EmployeeProfile.Api.DTOs;

public record EmployeeDto(
    int      Id,
    string   Name,
    string   Email,
    string   Department,
    string   Role,
    string   Experience,
    string   Status,
    int      Performance,
    string   Image,
    DateTime  CreatedAtUtc,
    DateTime? UpdatedAtUtc
);

public record CreateEmployeeDto(
    [Required][MaxLength(100)] string Name,
    [Required][MaxLength(150)] string Email,        // email format validated in service
    [Required][MaxLength(100)] string Department,
    [Required][MaxLength(100)] string Role,
    [Required][MaxLength(50)]  string Experience,
    [MaxLength(20)]            string Status      = "Active",
    [Range(0, 100)]            int    Performance = 80,
                               string Image       = ""
);

public record UpdateEmployeeDto(
    [Required][MaxLength(100)] string Name,
    [Required][MaxLength(150)] string Email,
    [Required][MaxLength(100)] string Department,
    [Required][MaxLength(100)] string Role,
    [Required][MaxLength(50)]  string Experience,
    [MaxLength(20)]            string Status,
    [Range(0, 100)]            int    Performance,
                               string Image
);
