import {
  UserRole,
  ProjectStatus,
  ProjectMethodology,
  RequirementStatus,
} from "../lib/enums";
import { Timestamp } from "firebase/firestore";

export type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  status: string;
  verified: boolean;
  verificationCode?: string;
  image?: string;
  occupation?: string;
};

export type Project = {
  _id: string;
  name: string;
  description: string;
  startDate: Date;
  estimatedEndDate: Date;
  actualEndDate: Date;
  createdAt: Date;
  status: ProjectStatus;
  createdBy: User;
  team: User[];
  prefferedMethodology: ProjectMethodology;
  githubToken?: string;
  githubUsername?: string;
  githubRepoName?: string;
  zoomRefreshToken?: string;
  progress?: number;
};

export interface Requirement {
  _id: string;
  title: string;
  description: string;
  projectId: string;
  parentId?: string | null;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  status: RequirementStatus;
}

export interface PaginationType {
  totalDocs: number;
  limit: number;
  page: number;
  nextPage: number;
  prevPage: number;
  totalPages: number;
  pagingCounter: number;
}

export interface PaginatedDocs<T> extends PaginationType {
  docs: T[];
}

export interface GitHubRepo {
  name: string;
  owner: {
    login: string;
    avatarUrl: string;
    url: string;
  };
  url: string;
}

export interface GithubCommit {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
  comments_url: string;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface GithubIssue {
  id: number;
  title: string;
  body: string;
  user: {
    login: string;
    html_url: string;
  };
  created_at: string;
  state: string;
}

export interface GithubPullRequest {
  id: number;
  title: string;
  body: string;
  user: {
    login: string;
    html_url: string;
  };
  created_at: string;
  state: string;
}

export interface UseCase {
  _id: string;
  name: string;
  description: string;
  preConditions: string[];
  postConditions: string[];
  flow: {
    actor: string;
    system: string;
    exception?: string;
  }[];
  requirement: string | Requirement;
  projectId: string;
  createdAt: Date;
}

export interface KanbanColumn {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
  order: number;
  projectId: string;
  maxLimit: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Sprint {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string;
  isExpanded?: boolean;
  status: "Planning" | "Active" | "Completed";
}

export interface ChatMessage {
  _id: string;
  senderId: string;
  projectId: string;
  timestamp: Date;
  content: {
    text?: string;
    images?: string[];
    files?: {
      name: string;
      size: number;
      url: string;
    }[];
  };
}

export interface ZoomMeeting {
  projectId: string;
  _id: string;
  topic: string;
  start_time: Timestamp;
  duration: number;
  agenda: string;
  join_url: string;
  start_url: string;
  created_at: Timestamp;
  status: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  requirement?: string | Requirement;
  priority: "High" | "Medium" | "Low";
  assignedTo: string | User;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  points: number;
  column?: string | KanbanColumn;
  status: "Open" | "In Progress" | "Done";
  githubCommit?: string;
  type: "Epic" | "Story" | "Task" | "Bug";
  sprint?: string | Sprint | null;
}

export interface Sprint {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  goal: string;
  project: string;
}

export interface Comment {
  _id: string;
  issueId: string | Issue;
  userId: string | User;
  content: string;
  timestamp: Date;
}

export interface IssueSummary {
  issuesCountByStatus: {
    name: string;
    color: string;
    value: number;
  }[];
  issuesCountByAssignee: {
    name: string;
    value: number;
  }[];
}

export interface GlobalSearchResult {
  requirements: Requirement[];
  usecases: UseCase[];
  issues: Issue[];
}

export interface SprintSummary {
  _id: string;
  totalIssues: number;
  doneIssues: number;
  sprint: Sprint;
  percentageDone: number;
}

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export type Notification = {
  _id: string;
  projectId?: string | null;
  userId?: string | null;
  message: string;
  type: "issue" | "comment";
  read: boolean;
  createdAt: Timestamp;
};

export interface LeaderboardEntry {
  assigneeId: string;
  assigneeDetails: {
    _id: string;
    name: string;
    image: string;
    occupation: string;
  };
  totalPoints: number;
}
