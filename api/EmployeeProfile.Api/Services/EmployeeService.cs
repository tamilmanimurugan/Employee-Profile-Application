using EmployeeProfile.Api.DTOs;
using EmployeeProfile.Api.Models;
using EmployeeProfile.Api.Repositories;
using Microsoft.Extensions.Caching.Memory;

namespace EmployeeProfile.Api.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repo;
    private readonly IMemoryCache        _cache;
    private const string CacheKey        = "all_employees";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(5);

    public EmployeeService(IEmployeeRepository repo, IMemoryCache cache)
    {
        _repo  = repo;
        _cache = cache;
    }

    // ── Queries ───────────────────────────────────────────────────────────────

    public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
    {
        // Return from cache if available; otherwise hit the DB
        if (_cache.TryGetValue(CacheKey, out IEnumerable<EmployeeDto>? cached) && cached != null)
            return cached;

        var list = (await _repo.GetAllAsync()).Select(ToDto).ToList();
        _cache.Set(CacheKey, list, CacheDuration);
        return list;
    }

    public async Task<EmployeeDto?> GetByIdAsync(int id)
    {
        var emp = await _repo.GetByIdAsync(id);
        return emp is null ? null : ToDto(emp);
    }

    public async Task<IEnumerable<EmployeeDto>> SearchAsync(string query)
        => (await _repo.SearchAsync(query)).Select(ToDto);

    // ── Commands ──────────────────────────────────────────────────────────────

    public async Task<(EmployeeDto? dto, string? error)> CreateAsync(CreateEmployeeDto dto)
    {
        if (!IsValidEmail(dto.Email))
            return (null, $"'{dto.Email}' is not a valid email address.");

        if (await _repo.EmailExistsAsync(dto.Email))
            return (null, $"Email '{dto.Email}' is already registered.");

        var employee = new Employee
        {
            Name         = dto.Name.Trim(),
            Email        = dto.Email.Trim().ToLower(),
            Department   = dto.Department.Trim(),
            Role         = dto.Role.Trim(),
            Experience   = dto.Experience.Trim(),
            Status       = dto.Status,
            Performance  = dto.Performance,
            Image        = string.IsNullOrWhiteSpace(dto.Image)
                             ? $"https://i.pravatar.cc/100?img={Random.Shared.Next(1, 70)}"
                             : dto.Image,
            CreatedAtUtc = DateTime.UtcNow,
        };

        var created = await _repo.AddAsync(employee);
        InvalidateCache();
        return (ToDto(created), null);
    }

    public async Task<(EmployeeDto? dto, string? error)> UpdateAsync(int id, UpdateEmployeeDto dto)
    {
        var employee = await _repo.GetByIdAsync(id);
        if (employee is null) return (null, null);

        if (await _repo.EmailExistsAsync(dto.Email, excludeId: id))
            return (null, $"Email '{dto.Email}' is already used by another employee.");

        employee.Name        = dto.Name.Trim();
        employee.Email       = dto.Email.Trim().ToLower();
        employee.Department  = dto.Department.Trim();
        employee.Role        = dto.Role.Trim();
        employee.Experience  = dto.Experience.Trim();
        employee.Status      = dto.Status;
        employee.Performance = dto.Performance;

        if (!string.IsNullOrWhiteSpace(dto.Image))
            employee.Image = dto.Image;

        var updated = await _repo.UpdateAsync(employee);
        InvalidateCache();
        return (ToDto(updated), null);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var deleted = await _repo.DeleteAsync(id);
        if (deleted) InvalidateCache();
        return deleted;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    // Clear cache after any write so the next GET returns fresh data
    private void InvalidateCache() => _cache.Remove(CacheKey);

    private static EmployeeDto ToDto(Employee e) => new(
        e.Id, e.Name, e.Email, e.Department,
        e.Role, e.Experience, e.Status, e.Performance,
        e.Image, e.CreatedAtUtc, e.UpdatedAtUtc
    );

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email.Trim();
        }
        catch { return false; }
    }
}
