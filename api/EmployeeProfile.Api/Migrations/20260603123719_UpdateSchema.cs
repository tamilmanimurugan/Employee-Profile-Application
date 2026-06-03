using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeProfile.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Employees");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Employees",
                newName: "UpdatedAtUtc");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Employees",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldDefaultValue: "Active");

            migrationBuilder.AlterColumn<int>(
                name: "Performance",
                table: "Employees",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 80);

            migrationBuilder.AlterColumn<string>(
                name: "Image",
                table: "Employees",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldDefaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "Employees",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "Employees");

            migrationBuilder.RenameColumn(
                name: "UpdatedAtUtc",
                table: "Employees",
                newName: "UpdatedAt");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Employees",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Active",
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<int>(
                name: "Performance",
                table: "Employees",
                type: "int",
                nullable: false,
                defaultValue: 80,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Image",
                table: "Employees",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Employees",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");
        }
    }
}
