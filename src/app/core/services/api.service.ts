import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { MockDataService } from './mock-data.service';
import { Project, Issue, User, CreateProjectPayload, CreateIssuePayload } from '../models';
import { v4 as uuid } from 'uuid';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // Simulates HTTP calls with delays to feel realistic

  constructor(private mockData: MockDataService) {}

  // --- Projects ---
  getProjects(): Observable<Project[]> {
    return of(this.mockData.getProjects()).pipe(delay(600));
  }

  getProject(id: string): Observable<Project> {
    const project = this.mockData.getProjectById(id);
    if (!project) {
      return throwError(() => new Error(`Project ${id} not found`)).pipe(delay(300));
    }
    return of(project).pipe(delay(400));
  }

  createProject(payload: CreateProjectPayload): Observable<Project> {
    const project: Project = {
      id: uuid(),
      ...payload,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      memberIds: [payload.ownerId],
      issueCount: 0,
      openIssueCount: 0,
    };
    return of(project).pipe(delay(800));
  }

  // --- Issues ---
  getIssues(): Observable<Issue[]> {
    return of(this.mockData.getIssues()).pipe(delay(500));
  }

  getIssuesByProject(projectId: string): Observable<Issue[]> {
    return of(this.mockData.getIssuesByProject(projectId)).pipe(delay(400));
  }

  getIssue(id: string): Observable<Issue> {
    const issue = this.mockData.getIssueById(id);
    if (!issue) {
      return throwError(() => new Error(`Issue ${id} not found`)).pipe(delay(300));
    }
    return of(issue).pipe(delay(350));
  }

  createIssue(payload: CreateIssuePayload): Observable<Issue> {
    const issue: Issue = {
      id: uuid(),
      ...payload,
      status: 'open',
      assigneeId: payload.assigneeId ?? null,
      labels: payload.labels ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    return of(issue).pipe(delay(700));
  }

  // 🐛 CHALLENGE 11 (RxJS - Race Condition):
  // This search method uses a simple delay but doesn't cancel previous requests
  // when a new search term arrives. In the component that calls this,
  // switchMap should be used instead of mergeMap/subscribe-in-subscribe.
  searchIssues(query: string): Observable<Issue[]> {
    const randomDelay = Math.random() * 1000 + 200;
    const results = this.mockData.getIssues().filter(i =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.description.toLowerCase().includes(query.toLowerCase())
    );
    return of(results).pipe(delay(randomDelay));
  }

  // --- Users ---
  getUsers(): Observable<User[]> {
    return of(this.mockData.getUsers()).pipe(delay(300));
  }

  getCurrentUser(): Observable<User> {
    return of(this.mockData.getUsers()[0]).pipe(delay(200));
  }

  // Simulates flaky endpoint for error handling challenges
  // 🐛 CHALLENGE 12 (RxJS - Error Handling):
  // This endpoint randomly fails. The component subscribing to it
  // doesn't handle errors, which kills the entire observable stream.
  getProjectStats(projectId: string): Observable<{ open: number; closed: number; velocity: number }> {
    if (Math.random() > 0.5) {
      return throwError(() => new Error('Stats service temporarily unavailable')).pipe(delay(300));
    }
    return of({ open: 5, closed: 12, velocity: 3.5 }).pipe(delay(500));
  }
}
