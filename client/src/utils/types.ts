export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  credits: number;
  creditHistory: { amount: number; reason: string; date: string }[];
  savedPosts: Post[];
  recentActivity: { action: string; date: string }[];
  profileCompleted: boolean;
  age?: number;
  gender?: "male" | "female" | "other";
}

export interface Post {
  _id: string;
  source: "x" | "reddit";
  content: string;
  author: string;
  externalId: string;
  createdAt: string;
  reported: boolean;
  reportReason?: string;
}

export interface UserDashboardData {
  credits: number;
  creditHistory: { amount: number; reason: string; date: string }[];
  savedPosts: Post[];
  recentActivity: { action: string; date: string }[];
}

export interface AdminDashboardData {
  totalUsers: number;
  reportedPosts: Post[];
}
