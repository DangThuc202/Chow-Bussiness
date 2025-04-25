import axios from "axios";

export const generateAIMarketingPlan = async (data: any) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/marketing_plan",
    data
  );

  return response?.data;
};

export const generatePost = async (data: any) => {
  const response = await axios.post("http://127.0.0.1:8000/posts", data);
  return response?.data;
};

export const convertImg = async (url: string) => {
  const response = await axios.post("http://127.0.0.1:8000/images/url", {
    url,
  });
  return response?.data; // Giả sử trả về sẽ là { img_urls: [...] }
};
