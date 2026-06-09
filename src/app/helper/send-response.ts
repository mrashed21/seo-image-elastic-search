import { Response } from "express";

interface IResponse<T> {
  status_code?: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

const send_response = <T>(res: Response, responseData: IResponse<T>) => {
  const { status_code = 200, success, message, data, meta } = responseData;
  res.status(status_code).json({
    success,
    message,
    data,
    meta,
  } as IResponse<T>);
};

export default send_response;
