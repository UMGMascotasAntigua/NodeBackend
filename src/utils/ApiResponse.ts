export class ApiResponse<T> {
    success: boolean;
    message: string;
    result: T | T[];
  
    constructor(success: boolean, message: string, result: T | T[]) {
      this.success = success;
      this.message = message;
      this.result = result;
    }
  }