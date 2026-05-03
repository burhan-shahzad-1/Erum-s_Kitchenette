export const STORAGE_KEYS = {
  CLIENT_USERS: 'erums_kitchenette_client_users',
  CLIENT_SESSION: 'erums_kitchenette_client_session',
  ADMIN_AUTH: 'adminAuthenticated',
} as const;

/** Admin panel — stored via AdminContext + localStorage */
export const ADMIN_CREDENTIALS = {
  email: 'burhanshahzad246@gmail.com',
  password: 'burhan123',
} as const;

export interface StoredClientUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  profilePicture?: string;
}

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop';

export function getSeedClientUsers(): StoredClientUser[] {
  return [
    {
      id: 'client-ayesha',
      name: 'Ayesha Shahid',
      email: 'ayeshashahid374@gmail.com',
      password: 'ayesha123',
      phone: '+92 300 0000000',
      address: 'Lahore, Pakistan',
      profilePicture: DEFAULT_AVATAR,
    },
  ];
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
