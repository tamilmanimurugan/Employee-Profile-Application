# EmployeeProfile.Api

ASP.NET Core Web API for the Angular Employee Profile app.

## Setup

1. Install the .NET 10 SDK.
2. Install SQL Server Express.
3. Update `appsettings.json` if your SQL Server connection string is different.
4. Run the API. The database is created automatically on first run.
5. Run the API:

```powershell
dotnet restore
dotnet run --project api/EmployeeProfile.Api
```

The API exposes:

- `GET /api/employees`
- `GET /api/employees/{id}`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `DELETE /api/employees/{id}`

Default connection string:

```json
"Server=.\\SQLEXPRESS;Database=EmployeeProfileDb;Trusted_Connection=True;TrustServerCertificate=True;"
```
