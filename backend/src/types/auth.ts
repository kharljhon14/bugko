export interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface DBUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface DBSSO {
  id: number;
  user_id: number;
  provider: string;
  provider_id: string;
}

export interface CreateSSO {
  user_id: number;
  provider: 'google' | 'github';
  provider_id: string;
}
