# Introduction 
TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project. 

# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

# Build and Test
TODO: Describe and show how to build your code and run the tests. 

## End-to-end tests

The repository includes Playwright end-to-end tests for the hosted login and logout flow.

Set the admin test password as an environment variable before running the tests. Do not commit the password.

```powershell
$env:E2E_ADMIN_PASSWORD = "<admin-test-password>"
npm run e2e
```

Optional environment variables:

```powershell
$env:E2E_BASE_URL = "https://employeeprofileweb-f3f9a0a7hzd9f7cm.southindia-01.azurewebsites.net"
$env:E2E_ADMIN_EMAIL = "admin@gmail.com"
```

The tests cover:

- Login with the admin test account and redirect to `/dashboard`.
- Dashboard content checks after login.
- Logout and redirect back to `/login`.

# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)
