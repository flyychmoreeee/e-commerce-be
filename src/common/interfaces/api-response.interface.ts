export interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  message?: string;
  data?: T;
  error_message?: string;
  timestamp?: string;
  meta?: any;
}
