import { User, UserLevel } from './types';

// Mocking the requested initial ADMIN user
// Password: "Gps51296@$"
// In a real frontend-only demo, we can't truly hash safely, but we will store this for validation.
export const INITIAL_ADMIN_USER: User = {
  id: '1',
  name: 'Gustavo Admin',
  email: 'gustavo230282@gmail.com',
  passwordHash: 'Gps51296@$', // Simulating the hash for the mock login check
  level: UserLevel.ADMIN
};

export const APP_NAME = "SysRetirada";
