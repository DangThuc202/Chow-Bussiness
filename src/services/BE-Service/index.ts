import httpClient from "@/client/httpClient";
import { useAuth } from "@/contexts/AuthContext";
import { GenerateBlogPayload, SaveBlog } from "@/types/Blog";
import axios from "axios";
import { data } from "react-router-dom";

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

// -------------------------------------------------------------------------------------------------------

export const updateProfile = async (data: any, token: string) => {
  const response = await httpClient.put("/api/user/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response?.data;
};

export const generateBlogPost = async (
  data: GenerateBlogPayload,
  token: string
) => {
  const response = await axios.post(
    "https://chow-business-webapp.azurewebsites.net/api/generate-posts",
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response?.data;
};

export const saveBlog = async (data: SaveBlog, token: string) => {
  const response = await axios.post(
    "https://chow-business-webapp.azurewebsites.net/api/save-post",
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response?.data;
};

export const getBlogHistory = async (token: string) => {
  const response = await axios.get(
    "https://chow-business-webapp.azurewebsites.net/api/generate-posts/history",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response?.data;
};

export const importKnowledge = async (post_id: string, token: string) => {
  const response = await axios.post(
    `https://chow-business-webapp.azurewebsites.net/api/knowledge-base/import`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        post_id,
      },
    }
  );

  return response?.data;
};

export const getAllKnowledge = async (token: string) => {
  const response = await axios.get(
    `https://chow-business-webapp.azurewebsites.net/api/knowledge-base/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response?.data;
};

export const deleteKnowledge = async (postId: string, token: string) => {
  const response = await axios.delete(
    `https://chow-business-webapp.azurewebsites.net/api/knowledge-base/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response?.data;
};

export const getPrompt = async (token: string) => {
  const response = await axios.get(
    `https://chow-business-webapp.azurewebsites.net/api/system-prompts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response?.data;
};

export const updatePrompt = async (content: string, token: string) => {
  const response = await axios.put(
    `https://chow-business-webapp.azurewebsites.net/api/system-prompts/customize`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        prompt_content: content,
      },
    }
  );

  return response.data;
};
