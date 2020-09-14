export interface FacebookLoginResponse {
  id: string;
  authToken: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  photoUrl: string;
  provider: string;
  response: FacebookResponse;
}

interface FacebookResponse {
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  name: string;
  picture: Picture;
}

interface Picture {
  data: Data;
}

interface Data {
  height: number;
  width: number;
  is_silhouette: boolean;
  url: string;
}
