export enum UserLevel {
  ADMIN = 'admin',
  OPERATOR = 'operador'
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // In a real app, never expose hashes to frontend like this. This is for the mock.
  level: UserLevel;
}

export interface Withdrawal {
  id: string;
  userId: string; // User who registered it
  userName: string; // Name of user who registered it
  recipientName: string; // Person who took the merchandise
  nfNumber: string;
  imageUrl: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
}

export type ViewState = 'dashboard' | 'new-withdrawal' | 'list-withdrawals' | 'admin-users' | 'report';