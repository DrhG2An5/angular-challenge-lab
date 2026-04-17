import { Injectable } from '@angular/core';
import { User, Project, Issue, IssuePriority, IssueStatus, ProjectStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private users: User[] = [
    { id: 'u1', name: 'Alice Johnson', email: 'alice@bugtracker.dev', avatar: 'A', role: 'admin' },
    { id: 'u2', name: 'Bob Smith', email: 'bob@bugtracker.dev', avatar: 'B', role: 'developer' },
    { id: 'u3', name: 'Carol Davis', email: 'carol@bugtracker.dev', avatar: 'C', role: 'developer' },
    { id: 'u4', name: 'Dave Wilson', email: 'dave@bugtracker.dev', avatar: 'D', role: 'viewer' },
  ];

  private projects: Project[] = [
    {
      id: 'p1', name: 'Frontend Redesign', description: 'Modernize the UI with Angular Material',
      status: 'active', createdAt: '2026-01-15', updatedAt: '2026-04-10',
      ownerId: 'u1', memberIds: ['u1', 'u2', 'u3'], issueCount: 12, openIssueCount: 5
    },
    {
      id: 'p2', name: 'API Gateway', description: 'Build the API gateway service',
      status: 'active', createdAt: '2026-02-01', updatedAt: '2026-04-12',
      ownerId: 'u2', memberIds: ['u2', 'u3'], issueCount: 8, openIssueCount: 3
    },
    {
      id: 'p3', name: 'Legacy Migration', description: 'Migrate legacy systems to cloud',
      status: 'on-hold', createdAt: '2025-11-20', updatedAt: '2026-03-01',
      ownerId: 'u1', memberIds: ['u1', 'u4'], issueCount: 20, openIssueCount: 15
    },
    {
      id: 'p4', name: 'Mobile App', description: 'Cross-platform mobile application',
      status: 'active', createdAt: '2026-03-01', updatedAt: '2026-04-15',
      ownerId: 'u3', memberIds: ['u2', 'u3', 'u4'], issueCount: 6, openIssueCount: 4
    },
  ];

  private issues: Issue[] = [
    {
      id: 'i1', title: 'Fix login page layout on mobile', description: 'The login form overflows on screens < 400px',
      status: 'open', priority: 'high', projectId: 'p1', assigneeId: 'u2', reporterId: 'u1',
      labels: ['bug', 'ui'], createdAt: '2026-04-01', updatedAt: '2026-04-10', comments: [
        { id: 'c1', text: 'Reproduced on iPhone SE', authorId: 'u3', createdAt: '2026-04-02' }
      ]
    },
    {
      id: 'i2', title: 'Add dark mode support', description: 'Implement system-level dark mode toggle',
      status: 'in-progress', priority: 'medium', projectId: 'p1', assigneeId: 'u3', reporterId: 'u1',
      labels: ['feature', 'ui'], createdAt: '2026-03-20', updatedAt: '2026-04-08', comments: []
    },
    {
      id: 'i3', title: 'Memory leak in dashboard charts', description: 'Charts subscription not cleaned up on destroy',
      status: 'open', priority: 'critical', projectId: 'p1', assigneeId: null, reporterId: 'u2',
      labels: ['bug', 'performance'], createdAt: '2026-04-05', updatedAt: '2026-04-05', comments: []
    },
    {
      id: 'i4', title: 'Rate limiting on API endpoints', description: 'Add rate limiting middleware',
      status: 'in-review', priority: 'high', projectId: 'p2', assigneeId: 'u2', reporterId: 'u2',
      labels: ['feature', 'security'], createdAt: '2026-03-15', updatedAt: '2026-04-11', comments: []
    },
    {
      id: 'i5', title: 'Database connection pooling', description: 'Optimize connection pool settings',
      status: 'done', priority: 'medium', projectId: 'p2', assigneeId: 'u3', reporterId: 'u2',
      labels: ['enhancement'], createdAt: '2026-02-20', updatedAt: '2026-04-01', comments: []
    },
    {
      id: 'i6', title: 'Migrate user table to new schema', description: 'Update user table columns for v2',
      status: 'open', priority: 'high', projectId: 'p3', assigneeId: 'u1', reporterId: 'u1',
      labels: ['migration'], createdAt: '2026-01-10', updatedAt: '2026-02-15', comments: []
    },
    {
      id: 'i7', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for automated deploys',
      status: 'in-progress', priority: 'high', projectId: 'p4', assigneeId: 'u3', reporterId: 'u3',
      labels: ['devops'], createdAt: '2026-03-05', updatedAt: '2026-04-14', comments: []
    },
    {
      id: 'i8', title: 'Unit tests for auth module', description: 'Write comprehensive tests for auth flows',
      status: 'open', priority: 'medium', projectId: 'p2', assigneeId: null, reporterId: 'u2',
      labels: ['testing'], createdAt: '2026-04-10', updatedAt: '2026-04-10', comments: []
    },
    {
      id: 'i9', title: 'Refactor navigation component', description: 'Convert to standalone with signal inputs',
      status: 'open', priority: 'low', projectId: 'p1', assigneeId: 'u2', reporterId: 'u1',
      labels: ['refactor'], createdAt: '2026-04-12', updatedAt: '2026-04-12', comments: []
    },
    {
      id: 'i10', title: 'Push notification support', description: 'Add Firebase push notifications',
      status: 'open', priority: 'medium', projectId: 'p4', assigneeId: null, reporterId: 'u3',
      labels: ['feature'], createdAt: '2026-04-13', updatedAt: '2026-04-13', comments: []
    },
  ];

  getUsers(): User[] { return this.users; }
  getProjects(): Project[] { return this.projects; }
  getIssues(): Issue[] { return this.issues; }
  getUserById(id: string): User | undefined { return this.users.find(u => u.id === id); }
  getProjectById(id: string): Project | undefined { return this.projects.find(p => p.id === id); }
  getIssueById(id: string): Issue | undefined { return this.issues.find(i => i.id === id); }
  getIssuesByProject(projectId: string): Issue[] { return this.issues.filter(i => i.projectId === projectId); }
}
