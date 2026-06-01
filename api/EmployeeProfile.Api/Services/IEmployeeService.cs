using EmployeeProfile.Api.DTOs;

namespace EmployeeProfile.Api.Services;

/// <summary>
/// Business-logic contract for employee operations.
/// Maps between DTOs and domain models; calls the repository.
/// </summary>
public interface IEmployeeService
{
    Task<IEnumerable<EmployeeDto>> GetAllAsync();
    Task<EmployeeDto?>             GetByIdAsync(int id);
    Task<IEnumerable<EmployeeDto>> SearchAsync(string query);
    Task<(EmployeeDto? dto, string? error)> CreateAsync(CreateEmployeeDto dto);
    Task<(EmployeeDto? dto, string? error)> UpdateAsync(int id, UpdateEmployeeDto dto);
    Task<bool>                     DeleteAsync(int id);
}
