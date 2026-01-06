import { User, Withdrawal, UserLevel } from '../types';
import { supabase } from './supaClient';

export const AuthService = {
  // Login is handled directly by logic in Login.tsx via supabase.auth.signInWithPassword
  // This helper retrieves users from 'profiles' table for Admin display
  getAllUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return data.map(p => ({
      id: p.id,
      name: p.name,
      email: p.email || '',
      passwordHash: '', // Not stored
      level: p.level as any
    }));
  },

  createUser: async (user: User): Promise<void> => {
    // For this MVP, we insert into profiles. 
    // Ideally, we should Create User in Auth system too, but that requires Admin API.
    // We assume the mapped user object has the ID from Auth or we generate one for the profile only.
    // If we are just storing profile data:
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: user.id, // ID must match an auth user if we want foreign key constraints to work! 
        // If we are mocking "Create User" without real signup, this will fail FK constraint if 'id' is random.
        // For now, we'll try to insert. If it fails due to FK, we might need a workaround or real Auth Signup.
        name: user.name,
        email: user.email,
        level: user.level
      });

    if (error) console.error('Error creating user profile:', error);
  }
};

export const WithdrawalService = {
  save: async (withdrawal: Withdrawal): Promise<void> => {
    const { error } = await supabase
      .from('withdrawals')
      .insert({
        user_id: withdrawal.userId,
        user_name: withdrawal.userName,
        recipient_name: withdrawal.recipientName,
        nf_number: withdrawal.nfNumber,
        image_url: withdrawal.imageUrl,
        timestamp: withdrawal.timestamp,
        latitude: withdrawal.latitude,
        longitude: withdrawal.longitude
      });

    if (error) throw error;
  },

  getAll: async (): Promise<Withdrawal[]> => {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching withdrawals:', error);
      return [];
    }

    return data.map(w => ({
      id: w.id,
      userId: w.user_id,
      userName: w.user_name,
      recipientName: w.recipient_name,
      nfNumber: w.nf_number,
      imageUrl: w.image_url,
      timestamp: w.timestamp,
      latitude: w.latitude,
      longitude: w.longitude
    }));
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('withdrawals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  uploadImage: async (file: File): Promise<string | null> => {
    // Sanitize filename: remove non-alphanumeric chars (keep dots and dashes)
    const sanitized = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const fileName = `${Date.now()}_${sanitized}`;
    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName);

    return publicUrl;
  }
};