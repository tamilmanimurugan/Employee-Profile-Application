using EmployeeProfile.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeProfile.Api.Data;

public sealed class EmployeeDbContext(DbContextOptions<EmployeeDbContext> options) : DbContext(options)
{
    public DbSet<Employee> Employees => Set<Employee>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.ToTable("Employees");

            entity.HasKey(employee => employee.Id);

            entity.Property(employee => employee.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(employee => employee.Email)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(employee => employee.Department)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(employee => employee.Role)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(employee => employee.Experience)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(employee => employee.Status)
                .HasMaxLength(30)
                .IsRequired()
                .HasDefaultValue("Active");

            entity.Property(employee => employee.Performance)
                .HasDefaultValue(80);

            entity.Property(employee => employee.Image)
                .HasColumnType("nvarchar(max)");

            entity.Property(employee => employee.CreatedAtUtc)
                .HasDefaultValueSql("SYSUTCDATETIME()");

            entity.Property(employee => employee.UpdatedAtUtc);

            entity.HasIndex(employee => employee.Email)
                .IsUnique();

            entity.ToTable(table =>
            {
                table.HasCheckConstraint("CK_Employees_Performance", "[Performance] >= 0 AND [Performance] <= 100");
            });
        });
    }
}