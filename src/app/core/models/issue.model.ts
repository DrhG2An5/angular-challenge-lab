export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  projectId: string;
  assigneeId: string | null;
  reporterId: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export type IssueStatus = 'open' | 'in-progress' | 'in-review' | 'done' | 'closed';
export type IssuePriority = 'critical' | 'high' | 'medium' | 'low';

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  createdAt: string;
}

export interface CreateIssuePayload {
  title: string;
  description: string;
  priority: IssuePriority;
  projectId: string;
  reporterId: string;
  assigneeId?: string;
  labels?: string[];
}
