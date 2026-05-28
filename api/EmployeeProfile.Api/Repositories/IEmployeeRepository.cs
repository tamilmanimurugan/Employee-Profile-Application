using EmployeeProfile.Api.Models;

namespace EmployeeProfile.Api.Repositories;

/// <summary>
/// Contract for all Employee data-access operations.
/// Keeps the service layer independent of EF Core details.
/// </summary>
public interface IEmployeeRepository
{
    Task<IEnumerable<Employee>> GetAllAsync();
    Task<Employee?>             GetByIdAsync(int id);
    Task<IEnumerable<Employee>> SearchAsync(string query);
    Task<Employee>              AddAsync(Employee employee);
    Task<Employee>              UpdateAsync(Employee employee);
    Task<bool>                  DeleteAsync(int id);
    Task<bool>                  ExistsAsync(int id);
    Task<bool>                  EmailExistsAsync(string email, int? excludeId = null);
}
