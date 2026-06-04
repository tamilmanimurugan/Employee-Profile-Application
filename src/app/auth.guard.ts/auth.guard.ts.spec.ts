import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthGuardTs } from './auth.guard.ts';

describe('AuthGuardTs', () => {
  let component: AuthGuardTs;
  let fixture: ComponentFixture<AuthGuardTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthGuardTs],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthGuardTs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
