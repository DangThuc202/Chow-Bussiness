import axios from "axios";

export const fetchLinkedInAccessToken = async (payload: {
  code: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
}) => {
  const params = new URLSearchParams({
    code: payload.code,
    redirect_uri: payload.redirect_uri,
    client_id: payload.client_id,
    client_secret: payload.client_secret,
  });

  const response = await axios.post(
    "http://localhost:1234/linkedin-login",
    params.toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return response.data;
};

export const getInfoUser = async (token: string) => {
  const response = await axios.get("http://localhost:1234/linkedin-userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response?.data;
};

export const postOnLinkedIn = async (content: any, token: string) => {
  console.log(content);
  console.log(token);

  const response = await axios.post(
    "http://localhost:1234/linkedin-post", // Gọi tới server nội bộ của bạn
    content,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Truyền token Bearer
      },
    }
  );

  return response?.data; // Trả về dữ liệu từ API LinkedIn
};
