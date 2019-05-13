import { TestBed, inject } from '@angular/core/testing';

import { AdminSuperAdminGuard } from './admin-super-admin.guard';

describe('AdminSuperAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminSuperAdminGuard]
    });
  });

  it('should ...', inject([AdminSuperAdminGuard], (guard: AdminSuperAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
