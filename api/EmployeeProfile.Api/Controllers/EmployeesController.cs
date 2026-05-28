using EmployeeProfile.Api.DTOs;
using EmployeeProfile.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeProfile.Api.Controllers;

/// <summary>
/// REST endpoints for Employee CRUD operations.
///
/// Base route : /api/employees
/// ─────────────────────────────────────────────────────────────
/// GET    /api/employees              → All employees
/// GET    /api/employees/{id}         → Single employee
/// GET    /api/employees/search?q=    → Search by name/email/dept/role
/// POST   /api/employees              → Create employee
/// PUT    /api/employees/{id}         → Update employee
/// DELETE /api/employees/{id}         → Delete employee
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _service;
    private readonly ILogger<EmployeesController> _logger;

    public EmployeesController(IEmployeeService service, ILogger<EmployeesController> logger)
    {
        _service = service;
        _logger  = logger;
    }

    // ── GET /api/employees ────────────────────────────────────────────────────

    /// <summary>Returns all employees ordered by name.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<EmployeeDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var employees = await _service.GetAllAsync();
        return Ok(employees);
    }

    // ── GET /api/employees/{id} ───────────────────────────────────────────────

    /// <summary>Returns a single employee by ID.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(EmployeeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var employee = await _service.GetByIdAsync(id);
        if (employee is null)
            return NotFound(new { message = $"Employee with ID {id} not found." });

        return Ok(employee);
    }

    // ── GET /api/employees/search?q=angular ──────────────────────────────────

    /// <summary>
    /// Full-text search across name, email, department and role.
    /// Returns all employees when query is empty.
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(IEnumerable<EmployeeDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Search([FromQuery] string q = "")
    {
        var employees = string.IsNullOrWhiteSpace(q)
            ? await _service.GetAllAsync()
            : await _service.SearchAsync(q);

        return Ok(employees);
    }

    // ── POST /api/employees ───────────────────────────────────────────────────

    /// <summary>Creates a new employee and persists it to SQL Server.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(EmployeeDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (created, error) = await _service.CreateAsync(dto);
        if (error is not null)
            return Conflict(new { message = error });

        _logger.LogInformation("Employee {Name} created with ID {Id}.", created!.Name, created.Id);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // ── PUT /api/employees/{id} ───────────────────────────────────────────────

    /// <summary>Updates an existing employee. Returns 404 if not found.</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(EmployeeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (updated, error) = await _service.UpdateAsync(id, dto);

        if (error is not null)
            return Conflict(new { message = error });

        if (updated is null)
            return NotFound(new { message = $"Employee with ID {id} not found." });

        _logger.LogInformation("Employee ID {Id} updated.", id);
        return Ok(updated);
    }

    // ── DELETE /api/employees/{id} ────────────────────────────────────────────

    /// <summary>Permanently deletes an employee by ID.</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = $"Employee with ID {id} not found." });

        _logger.LogInformation("Employee ID {Id} deleted.", id);
        return NoContent();
    }
}
