IF DB_ID(N'EmployeeProfileDb') IS NULL
BEGIN
    CREATE DATABASE EmployeeProfileDb;
END;
GO

USE EmployeeProfileDb;
GO

IF OBJECT_ID(N'dbo.Employees', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Employees
    (
        Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Employees PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(150) NOT NULL,
        Department NVARCHAR(100) NOT NULL,
        Role NVARCHAR(100) NOT NULL,
        Experience NVARCHAR(50) NOT NULL,
        Status NVARCHAR(30) NOT NULL CONSTRAINT DF_Employees_Status DEFAULT N'Active',
        Performance INT NOT NULL CONSTRAINT DF_Employees_Performance DEFAULT 80,
        Image NVARCHAR(MAX) NULL,
        CreatedAtUtc DATETIME2 NOT NULL CONSTRAINT DF_Employees_CreatedAtUtc DEFAULT SYSUTCDATETIME(),
        UpdatedAtUtc DATETIME2 NULL,
        CONSTRAINT UQ_Employees_Email UNIQUE (Email),
        CONSTRAINT CK_Employees_Performance CHECK (Performance >= 0 AND Performance <= 100)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Employees)
BEGIN
    INSERT INTO dbo.Employees
        (Name, Email, Department, Role, Experience, Status, Performance, Image)
    VALUES
        (N'Tamilmani', N'tamil@gmail.com', N'Development', N'Angular Developer', N'5 Years', N'Active', 90, N'https://i.pravatar.cc/100?img=12'),
        (N'Rahul', N'rahul@gmail.com', N'Backend', N'.NET Developer', N'4 Years', N'On Leave', 80, N'https://i.pravatar.cc/100?img=18'),
        (N'Priya', N'priya@gmail.com', N'UI/UX', N'UI Designer', N'3 Years', N'Active', 88, N'https://i.pravatar.cc/100?img=32'),
        (N'Karthika', N'karthika@gmail.com', N'Testing', N'QA Engineer', N'6 Years', N'Active', 92, N'https://i.pravatar.cc/100?img=45'),
        (N'Sneha', N'sneha@gmail.com', N'HR', N'HR Manager', N'7 Years', N'On Leave', 75, N'https://i.pravatar.cc/100?img=25'),
        (N'Arun', N'arun@gmail.com', N'Support', N'Support Engineer', N'2 Years', N'Active', 70, N'https://i.pravatar.cc/100?img=60'),
        (N'Divya', N'divya@gmail.com', N'Development', N'Frontend Developer', N'4 Years', N'Active', 95, N'https://i.pravatar.cc/100?img=15'),
        (N'Vijay', N'vijay@gmail.com', N'Marketing', N'Marketing Lead', N'5 Years', N'Active', 82, N'https://i.pravatar.cc/100?img=68'),
        (N'Meena', N'meena@gmail.com', N'Finance', N'Accountant', N'8 Years', N'On Leave', 78, N'https://i.pravatar.cc/100?img=49'),
        (N'Siva', N'siva@gmail.com', N'Security', N'Security Analyst', N'5 Years', N'Active', 85, N'https://i.pravatar.cc/100?img=53');
END;
GO
