export type ModalType = "setting" | "postSchedule";

export interface StepData {
  step: number;
  title: string;
  image: string;
  text: string; // chứa HTML
  text2?: string; // tùy chọn, chứa HTML
  image2?: string; // tùy chọn
}

export interface SchedulePostViewData {
  tab: string; // ví dụ: "facebook", "instagram"
  content: StepItem[];
}

export interface StepItem {
  title: string;
  text: string;
  image: string;
}

export interface Schedule {
  icon: any;
  title: string;
  content: string;
  open: any;
}
