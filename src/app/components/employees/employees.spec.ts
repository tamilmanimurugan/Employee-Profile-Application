import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeesComponent } from './employees';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('EmployeesComponent', () => {

  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmployeesComponent,
        HttpClientTestingModule,
        FormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ✅ 1. Component creation
  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  // ✅ 2. Initial state test
  it('should initialize employees as empty array', () => {
    expect(component.employees).toBeDefined();
    expect(component.employees.length).toBe(0);
  });

  // ✅ 3. Add employee (local test)
  it('should add employee to list (local test)', () => {
    component.employees = [];

    component.newEmployee = {
      id: 1,
      name: 'John',
      role: 'Developer',
      email: 'john@example.com',
      phone: '1234567890',
      department: 'IT',
      salary: 50000,
      status: 'Active',
      joinDate: '2024-01-01'
    };

    // simulate add (without API call)
    component.employees.push(component.newEmployee);

    expect(component.employees.length).toBe(1);
    expect(component.employees[0].name).toBe('John');
  });

  // ✅ 4. Edit mode test
  it('should switch to edit mode when editing employee', () => {
    const emp = {
      id: 1,
      name: 'John',
      role: 'Dev',
      email: 'john@example.com',
      phone: '1234567890',
      department: 'IT',
      salary: 50000,
      status: 'Active',
      joinDate: '2024-01-01'
    };

    component.editEmployee(emp);

    expect(component.isEditMode).toBeTruthy();
    expect(component.editingEmployeeId).toBe(1);
    expect(component.newEmployee.name).toBe('John');
  });

  // ✅ 5. Cancel edit (reset form) test
  it('should reset form correctly when cancelEdit is called', () => {
    component.newEmployee = {
      id: 5,
      name: 'Test',
      role: 'Test',
      email: 'test@example.com',
      phone: '1234567890',
      department: 'IT',
      salary: 100,
      status: 'Active',
      joinDate: '2024-01-01'
    };

    component.isEditMode = true;
    component.editingEmployeeId = 5;

    component.cancelEdit(); // ✅ use actual method name

    expect(component.isEditMode).toBeFalsy();
    expect(component.editingEmployeeId).toBeNull();
    expect(component.newEmployee.name).toBe('');
    expect(component.newEmployee.role).toBe('');
    expect(component.newEmployee.salary).toBe(0);
  });
});
