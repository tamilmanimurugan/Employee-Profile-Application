using EmployeeProfile.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeProfile.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Employee> Employees { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.ToTable("Employees");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Department).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Role).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Experience).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Performance);
            entity.Property(e => e.Image).HasMaxLength(1000);

            // Map to the exact column names already in your SQL Server table
            entity.Property(e => e.CreatedAtUtc).HasColumnName("CreatedAtUtc");
            entity.Property(e => e.UpdatedAtUtc).HasColumnName("UpdatedAtUtc");
        });
    }
}
