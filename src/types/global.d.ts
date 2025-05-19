interface Window {
  FB: {
    init: (params: {
      appId: string;
      cookie: boolean;
      xfbml: boolean;
      version: string;
    }) => void;
    login: (
      callback: (response: any) => void,
      options?: { scope: string }
    ) => void;
    logout: (callback: (response: any) => void) => void; // Thêm phương thức logout
    api: (path: string, callback: (response: any) => void) => void;
    api: (
      path: string,
      method: string,
      params: Record<string, any>,
      callback: (response: any) => void
    ) => void;
  };
  fbAsyncInit: () => void;

  LinkedIn: {
    init: (params: {
      clientId: string;
      redirectUri: string;
      scope: string;
    }) => void;

    login: (
      callback: (response: {
        code?: string;
        state?: string;
        error?: string;
        errorMessage?: string;
      }) => void,
      options?: { scope: string }
    ) => void;

    logout: (callback: (response: any) => void) => void;

    api: (path: string, callback: (response: any) => void) => void;
    api: (
      path: string,
      method: "GET" | "POST" | "PUT" | "DELETE",
      params: Record<string, any>,
      callback: (response: any) => void
    ) => void;
  };
  linkedInAsyncInit: () => void;
}
