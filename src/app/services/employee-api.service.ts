import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, shareReplay, tap } from 'rxjs';
import { Employee, CreateEmployeePayload, UpdateEmployeePayload } from './employee.model';

const API_BASE = 'http://localhost:5000/api/employees';

@Injectable({ providedIn: 'root' })
export class EmployeeApiService {

  private readonly http = inject(HttpClient);

  // Cache the GET-all result — navigating away and back is instant
  private cache$: Observable<Employee[]> | null = null;

  getAll(): Observable<Employee[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<Employee[]>(API_BASE).pipe(
        shareReplay(1),
        catchError(this.handleError)
      );
    }
    return this.cache$;
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${API_BASE}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  search(query: string): Observable<Employee[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Employee[]>(`${API_BASE}/search`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  create(payload: CreateEmployeePayload): Observable<Employee> {
    return this.http.post<Employee>(API_BASE, payload).pipe(
      tap(() => this.invalidateCache()),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: UpdateEmployeePayload): Observable<Employee> {
    return this.http.put<Employee>(`${API_BASE}/${id}`, payload).pipe(
      tap(() => this.invalidateCache()),
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${id}`).pipe(
      tap(() => this.invalidateCache()),
      catchError(this.handleError)
    );
  }

  // Force a fresh DB call next time getAll() is invoked
  invalidateCache(): void {
    this.cache$ = null;
  }

  private handleError(error: any): Observable<never> {
    const msg = error?.error?.message ?? error?.message ?? 'Unknown API error';
    console.error('[EmployeeApiService]', msg, error);
    return throwError(() => new Error(msg));
  }
}
