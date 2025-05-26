export interface GoogleUser {
  data: {
    user_id: string;
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
  };
}
