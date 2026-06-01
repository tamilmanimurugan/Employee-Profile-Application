using EmployeeProfile.Api.Data;
using EmployeeProfile.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeProfile.Api.Repositories;

/// <summary>
/// EF Core implementation of <see cref="IEmployeeRepository"/>.
/// All queries hit SQL Server via AppDbContext.
/// </summary>
public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _db;

    public EmployeeRepository(AppDbContext db) => _db = db;

    // ── Read ──────────────────────────────────────────────────────────────────

    public async Task<IEnumerable<Employee>> GetAllAsync()
        => await _db.Employees
                    .OrderBy(e => e.Name)
                    .ToListAsync();

    public async Task<Employee?> GetByIdAsync(int id)
        => await _db.Employees.FindAsync(id);

    public async Task<IEnumerable<Employee>> SearchAsync(string query)
    {
        var q = query.Trim().ToLower();
        return await _db.Employees
            .Where(e =>
                e.Name.ToLower().Contains(q)       ||
                e.Email.ToLower().Contains(q)      ||
                e.Department.ToLower().Contains(q) ||
                e.Role.ToLower().Contains(q))
            .OrderBy(e => e.Name)
            .ToListAsync();
    }

    // ── Write ─────────────────────────────────────────────────────────────────

    public async Task<Employee> AddAsync(Employee employee)
    {
        employee.CreatedAtUtc = DateTime.UtcNow;
        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();
        return employee;
    }

    public async Task<Employee> UpdateAsync(Employee employee)
    {
        employee.UpdatedAtUtc = DateTime.UtcNow;
        _db.Employees.Update(employee);
        await _db.SaveChangesAsync();
        return employee;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var employee = await _db.Employees.FindAsync(id);
        if (employee is null) return false;

        _db.Employees.Remove(employee);
        await _db.SaveChangesAsync();
        return true;
    }

    // ── Existence helpers ─────────────────────────────────────────────────────

    public async Task<bool> ExistsAsync(int id)
        => await _db.Employees.AnyAsync(e => e.Id == id);

    /// <param name="excludeId">When updating, exclude the current employee from the uniqueness check.</param>
    public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
        => await _db.Employees.AnyAsync(e =>
            e.Email == email &&
            (excludeId == null || e.Id != excludeId));
}
