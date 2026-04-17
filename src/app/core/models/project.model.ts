export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  memberIds: string[];
  issueCount: number;
  openIssueCount: number;
}

export type ProjectStatus = 'active' | 'archived' | 'on-hold';

export interface CreateProjectPayload {
  name: string;
  description: string;
  ownerId: string;
}
