import axios from "axios";
import { access } from "fs";

export const fetchFBPage = async (accessToken: string) => {
  const response = await axios.get(
    "https://graph.facebook.com/v21.0/me/accounts",
    {
      params: { access_token: accessToken },
    }
  );

  return response?.data;
};

export const fetchPagePosts = async (pageToken: string, pageId: string) => {
  const response = await axios.get(
    `https://graph.facebook.com/v21.0/${pageId}/posts`,
    {
      params: {
        fields: "id,message,full_picture,permalink_url,created_time",
        limit: 10,
        access_token: pageToken,
      },
    }
  );

  return response.data?.data.map((post: any) => ({
    id: post.id,
    content: post.message || "", // Fallback nếu message bị undefined
    url: post.permalink_url,
    tag: "Facebook",
  }));
};

type SchedulePostInput = {
  pageToken: string;
  pageId: string;
  message: string;
  imageUrl: string[] | null;
  scheduledTime: number;
};

export const schedulePostFacebook = async ({
  pageToken,
  pageId,
  message,
  imageUrl,
  scheduledTime,
}: SchedulePostInput) => {
  try {
    let postData: any = {
      message,
      published: false,
      scheduled_publish_time: scheduledTime,
      access_token: pageToken,
    };
    if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      const { data: uploadData } = await axios.post(
        `https://graph.facebook.com/v21.0/${pageId}/photos`,
        {
          url: imageUrl[0],
          published: false,
          access_token: pageToken,
        }
      );

      postData.attached_media = [{ media_fbid: uploadData.id }];
    }

    const { data: postResult } = await axios.post(
      `https://graph.facebook.com/v21.0/${pageId}/feed`,
      postData
    );

    return postResult;
  } catch (err: any) {
    throw new Error(`Error scheduling post: ${err.message}`);
  }
};

export const getScheduledPostFacebook = async (
  pageToken: string,
  postId: string
) => {
  const response = await axios.get(
    `https://graph.facebook.com/v21.0/${postId}`,
    {
      params: {
        fields:
          "id,message,scheduled_publish_time,created_time,status_type,full_picture,attachments{media,subattachments}",
        access_token: pageToken,
      },
    }
  );
  return response?.data;
};

export const getAllSchedulePostFacebook = async (
  pageToken: string,
  pageId: string
) => {
  const response = await axios.get(
    `https://graph.facebook.com/v21.0/${pageId}/scheduled_posts`,
    {
      params: {
        fields:
          "id,message,scheduled_publish_time,created_time,status_type,attachments{media,subattachments},full_picture",
        access_token: pageToken,
      },
    }
  );

  return response?.data;
};

export const deleteSchedulePostFacebook = async (
  postId: string,
  pageToken: string
) => {
  const response = await axios.delete(
    `https://graph.facebook.com/v21.0/${postId}`,
    { params: { access_token: pageToken } }
  );

  return response?.data;
};

export const getPageTokenByPageId = async (
  userAccessToken: string,
  pageId: string
): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${userAccessToken}`
    );
    const data = await res.json();

    const matchedPage = data.data.find((page: any) => page.id === pageId);
    return matchedPage?.access_token || null;
  } catch (err) {
    console.error("Lỗi khi lấy page token:", err);
    return null;
  }
};
