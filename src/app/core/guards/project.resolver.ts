import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Project } from '../models';
import { ApiService } from '../services/api.service';

// 🐛 CHALLENGE 21 (Routing - Resolver):
// This resolver should load a project before the route activates.
// But it reads the wrong route parameter — uses 'id' instead of 'projectId'
// which matches the route config `:projectId`.
// FIX: Use route.paramMap.get('projectId') instead of route.paramMap.get('id')

export const projectResolver: ResolveFn<Project> = (route, state) => {
  const apiService = inject(ApiService);

  // 🐛 BUG: Route param is 'projectId' but this reads 'id'
  const projectId = route.paramMap.get('id')!;
  return apiService.getProject(projectId);
};
