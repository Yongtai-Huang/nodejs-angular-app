import { TestBed, async, inject } from '@angular/core/testing';

import { AdminSuperUserGuard } from './admin-super-user.guard';

describe('AdminSuperUserGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminSuperUserGuard]
    });
  });

  it('should ...', inject([AdminSuperUserGuard], (guard: AdminSuperUserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
