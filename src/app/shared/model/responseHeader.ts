export interface ResponseHeader {
  statusCode: number;
  data: any;
  isSuccess: boolean;
  message: string;
  errors: any;
}
