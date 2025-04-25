export interface GenerateSchedulePlanRequest {
  social_platform: string;
  business: string;
  language: string;
  knowledge_base: string;
  post_titles: string[];
  timestamps: number[];
}
export interface GenerateSchedulePlanResponse {
  social_platform: string;
  social_posts: string[];
  timestamps: number[];
}

export interface GeneratePostRequest {
  social_platform: string;
  business: string;
  language: string;
  knowledge_base: string;
  n_days: number | null;
}
export interface GeneratePostRequestMarketingPlan {
  social_platform: string;
  business: string;
  language: string;
  knowledge_base: string;
  n_days: number | null;
}

export type GenerateMarketingPlanResponse = {
  marketing_plan: string;
  post_titles: string[];
  timestamps: [];
};
export interface GeneratePostResponse {
  social_posts: string[];
}

export interface ISocialMedia {
  id: string;
  tag: string;
  url: string;
  content: string;
}

export interface IKnowledgeBase {
  newContent: string;
  sampleContent: string;
}

export const INITIAL_COURSE_SETUP: ICourseSetup = {
  subject: "",
  content: "",
  chapterCount: "",
  lessonsPerChapter: "",
  exercisesPerLesson: "",
};

export interface IChapter {
  title: string;
  description: string;
}

export interface ICourse {
  title: string;
  description: string;
  chapters: IChapter[];
}
export interface IMessage {
  text: string;
  isUser: boolean;
  suggestions?: string[];
  messageType: number;
}

export const MESSAGE_TYPE = {
  TEXT: 1,
  FILE: 2,
  IMAGE: 3,
  MEDIA: 4,
  LINK: 5,
  COURSE: 6,
  SUMMARY: 7,
};

import axios from "axios";

export interface IMessage {
  text: string;
  isUser: boolean;
  suggestions?: string[];
  messageType: number;
}

export interface ISocialMedia {
  id: string;
  tag: string;
  url: string;
  content: string;
}
export const STEPS = [
  "previousContents",
  "mainGoal",
  "targetAudience",
  "events",
  "typeOfContent",
  "hashtags",
  "n_days",
] as const;

export const DEMO_RESPONSES: Record<
  (typeof STEPS)[number],
  { text: string; suggestions: string[] }
> = {
  previousContents: {
    text: "📚 Do you want your previous contents to be incorporated into our marketing strategy?",
    suggestions: ["Yes", "No"],
  },
  mainGoal: {
    text: "📖 What is the main goal of your social media content in the next month ?",
    suggestions: [
      "Brand Awareness",
      "Engagement",
      "Lead Generations",
      "Sales",
      "Other",
    ],
  },
  targetAudience: {
    text: "📂 Who is your target audience, and what tone or style resonates with them ?",
    suggestions: [
      "Professional",
      "Friendly",
      "Humorous",
      "informative",
      "Other",
    ],
  },
  events: {
    text: "📑 Do you have any upcoming promotions, events, or product launches that should be highlighted?",
    suggestions: ["Christmas", "Halloween", "Friday Special", "Other"],
  },
  typeOfContent: {
    text: "✏️ What type of content do you prefer?",
    suggestions: [
      "Educational tips",
      "Behind-the-scenes",
      "Testimonials",
      "  user-generated content",
      "Other",
    ],
  },
  hashtags: {
    text: "✏️Are there any specific keywords, hashtags, or brand messages you want included in each post?",
    suggestions: [
      "#Marketing",
      "#BrandGrowth",
      "#SocialMedia",
      "#Engagement",
      "Other",
    ],
  },
  n_days: {
    text: "✏️How many days should your marketing plan cover? (Enter the number of days)",
    suggestions: ["10", "20", "30", "Other"],
  },
};

export const generateCourse = async (data: unknown) => {
  const response = await axios.post("/api/openai/genCourse", data);
  const course = await response.data.course;
  return course;
};

export interface ICourseSetup {
  subject: string;
  content: string;
  chapterCount: string;
  lessonsPerChapter: string;
  exercisesPerLesson: string;
}

export interface IChapter {
  title: string;
  description: string;
}

export interface ICourse {
  title: string;
  description: string;
  chapters: IChapter[];
}
export interface IKnowledgeBase {
  newContent: string;
  sampleContent: string;
}

export interface ScheduleResponse {
  social_platform: string;
  social_posts: string[]; // Mảng các bài đăng
  timestamps: number[]; // Mảng các thời gian lên lịch
  postImageUrls?: string[]; // Mảng các URL hình ảnh (chỉ dùng cho Instagram)
}
