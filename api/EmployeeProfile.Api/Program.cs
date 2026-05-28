using EmployeeProfile.Api.Data;
using EmployeeProfile.Api.Repositories;
using EmployeeProfile.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ─── Services ─────────────────────────────────────────────────────────────────

builder.Services.AddControllers();
builder.Services.AddMemoryCache();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title   = "Employee Profile API",
        Version = "v1",
        Description = "ASP.NET Core Web API for Employee Profile Application"
    });
});

// Entity Framework Core — SQL Server Express
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sql => sql.EnableRetryOnFailure(3)
    )
);

// Dependency injection — Repository + Service
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

// CORS — allow Angular dev server (http://localhost:4200)
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? ["http://localhost:4200"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
    );
});

var app = builder.Build();

// ─── Middleware pipeline ───────────────────────────────────────────────────────

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Employee Profile API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowAngular");
app.UseAuthorization();
app.MapControllers();

// ─── Auto-migrate + seed on startup ───────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db  = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var log = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        // EnsureCreated: creates tables only if they don't already exist.
        // Safe to run even when DB already has data — does nothing in that case.
        db.Database.EnsureCreated();
        await SeedData.SeedAsync(db);
        log.LogInformation("Database ready.");
    }
    catch (Exception ex)
    {
        log.LogError(ex, "Database startup failed: {Message}", ex.Message);
    }
}

app.Run();
