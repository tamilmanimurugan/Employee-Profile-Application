/** Matches the EmployeeDto returned by the ASP.NET Core API */
export interface Employee {
  id?:          number;
  name:         string;
  email:        string;
  department:   string;
  role:         string;
  experience:   string;
  status:       string;
  performance:  number;
  image:        string;
  createdAtUtc?:   string;
  updatedAtUtc?:   string;
}

/** Payload for POST /api/employees */
export interface CreateEmployeePayload {
  name:        string;
  email:       string;
  department:  string;
  role:        string;
  experience:  string;
  status:      string;
  performance: number;
  image:       string;
}

/** Payload for PUT /api/employees/{id} */
export type UpdateEmployeePayload = CreateEmployeePayload;
