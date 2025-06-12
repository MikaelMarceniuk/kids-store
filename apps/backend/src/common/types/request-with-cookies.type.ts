export interface RequestWithCookies extends Request {
  cookies: {
    refresh_token?: string;
    access_token?: string;
    [key: string]: string | undefined;
  };
}
