// Request gửi lên API
export interface GeneratePostRequestMarketingPlan {
  social_platform: string;
  business: string;
  language: string;
  knowledge_base: string;
  n_days: number | null;
}

// Response nhận từ API
export interface GenerateMarketingPlanResponse {
  marketing_plan: string;
  post_titles: string[];
  timestamps: any[]; // có thể dùng string[] nếu backend trả về là array string
}
