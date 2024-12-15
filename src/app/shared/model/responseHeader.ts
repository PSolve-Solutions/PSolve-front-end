export interface ResponseHeader {
  statusCode: number;
  data: any;
  isSuccess: boolean;
  message: string;
  errors: any;
}
export interface CurrentUser {
  id: string;
  firstName: string;
  middleName: string;
  roles: string[];
  token: string;
  photoUrl: any;
  communityLogo: string;
}
