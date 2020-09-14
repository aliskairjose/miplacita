export interface FacebookLoginResponse {
  id: string;
  authToken: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  photoUrl: string;
  provider: string;
  response: any;
}

export interface FacebookResponse {
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  name: string;
  picture: Picture;
}

export interface Picture {
  data: Data;
}

export interface Data {
  height: number;
  width: number;
  is_silhouette: boolean;
  url: string;
}