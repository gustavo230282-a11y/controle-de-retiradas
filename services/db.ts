import { User, Withdrawal, UserLevel } from '../types';
import { INITIAL_ADMIN_USER } from '../constants';

const USERS_KEY = 'sys_users';
const WITHDRAWALS_KEY = 'sys_withdrawals';

// Initialize DB with Admin if empty
const initDB = () => {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    localStorage.setItem(USERS_KEY, JSON.stringify([INITIAL_ADMIN_USER]));
  }
};

initDB();

export const AuthService = {
  login: (email: string, password: string): User | null => {
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    
    // Simple string comparison for the mock. In real PHP/MySQL, use password_verify().
    const user = users.find(u => u.email === email && u.passwordHash === password);
    return user || null;
  },

  createUser: (user: User): void => {
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getAllUsers: (): User[] => {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  }
};

export const WithdrawalService = {
  save: (withdrawal: Withdrawal): void => {
    const dataStr = localStorage.getItem(WITHDRAWALS_KEY);
    const list: Withdrawal[] = dataStr ? JSON.parse(dataStr) : [];
    // Prepend to show newest first
    list.unshift(withdrawal); 
    // Limit to last 50 for storage safety in this demo
    if (list.length > 50) list.pop();
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(list));
  },

  getAll: (): Withdrawal[] => {
    const dataStr = localStorage.getItem(WITHDRAWALS_KEY);
    return dataStr ? JSON.parse(dataStr) : [];
  }
};