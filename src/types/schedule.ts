export interface IScheduleItem {
    id: string;
    social_id: string;
    page: string;
    time: Date;
    caption: string;
    url: string;
    image_id?: string;
    status?: boolean;
    imageUrl: string;

}

export interface IPostState {
    postMessage: string;
    postImageUrl: string;
    scheduledTime: string;
}
export interface IAccountSate {
    selectedPageToken: string,
    selectedPageId: string,
    selectedPageName: string,
    selectedInstagramBusinessId: string,
}