// steps.ts
import { SchedulePostViewData, StepData, StepItem } from "@/types/modal";

export const contentMapVI: Record<
  "setting" | "postSchedule",
  StepData[] | SchedulePostViewData[]
> = {
  setting: [
    {
      step: 1,
      title: `setting.step1`,
      image:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/1a-1.png",
      text: `<span class="xl:text-base text-xs">Để bắt đầu, hãy điều hướng trình duyệt của bạn đến <a style="color: blue; text-decoration: underline;" href="https://developers.facebook.com/" target="_blank">Facebook Developers page</a>. Bạn sẽ cần phải đăng nhập vào tài khoản Facebook của mình. Sau khi đăng nhập, bạn sẽ thấy một màn hình tương tự như thế này.</span>`,
      text2: `<span class="xl:text-base text-xs">Để bắt đầu, click vào <span style="font-weight: 600;">Add a New App</span> liên kết dưới <span style="font-weight: 600;">My Apps</span> menu nằm ở góc bên phải.</span>`,
    },
    {
      step: 2,
      title: `setting.step2`,
      image:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/2-5.png",
      text: `<span class="xl:text-base text-xs">Sau khi bạn nhấn vào liên kết <span style="font-weight: 600;">Add a New App</span>, một hộp thoại sẽ xuất hiện yêu cầu bạn nhập Tên hiển thị của Ứng dụng mới và Địa chỉ E-Mail liên hệ. Nhập Tên hiển thị của Ứng dụng và nhấn <span style="font-weight: 600;">Create App ID</span>.</span>`,
    },
    {
      step: 3,
      title: `setting.step3`,
      image:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/3-4.png",
      text: `<span class="xl:text-base text-xs">Bây giờ bạn cần thêm sản phẩm <span style="font-weight: 600;">Facebook Login</span> vào ứng dụng của mình. Để làm điều đó, hãy nhấn nút <span style="font-weight: 600;">Set Up</span>.</span>`,
      text2: `<span class="xl:text-base text-xs">Sau khi nhấn nút <span style="font-weight: 600;">Set Up</span>, bạn sẽ được chuyển hướng đến trang <span style="font-weight: 600;">Quickstart</span>. <br/> Để bắt đầu, hãy chọn nền tảng cho ứng dụng này. Bây giờ hãy chọn nền tảng <span style="font-weight: 600;">Web</span> cho ứng dụng.</span>`,
      image2:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/4-4.png",
    },
    {
      step: 4,
      title: `setting.step4`,
      image:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/5-3.png",
      text: `<span class="xl:text-base text-xs">Sau khi nhấn vào <span style="font-weight: 600;">Web</span>, một tab mới sẽ mở ra. Bây giờ hãy nhập URL trang web của bạn vào đây và nhấn nút <span style="font-weight: 600;">Save</span>.</span>`,
      text2: `<span class="xl:text-base text-xs">Sau khi nhấn nút <span style="font-weight: 600;">Save</span>, hãy bỏ qua phần còn lại. Bây giờ nhấn vào <span style="font-weight: 600;">Settings</span> trong danh sách menu bên trái. <br/> Nhập URL chuyển hướng vào đây và sau đó nhấn nút <span style="font-weight: 600;">Save Changes</span> để lưu lại thông tin.</span>`,
      image2:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/6-2.png",
    },
    {
      step: 5,
      title: `setting.step5`,
      image:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/7-1.png",
      text: `<span class="xl:text-base text-xs">Để đưa ứng dụng của bạn lên hoạt động, bạn cần nhập thêm một số thông tin. Để làm điều này, nhấn vào tab <span style="font-weight: 600;">Basic</span> bên trong <span style="font-weight: 600;">Settings</span> trong danh sách menu bên trái. <br/>Sau khi nhấn vào tab <span style="font-weight: 600;">Basic</span>, bạn cần nhập <span style="font-weight: 600;">App Domains</span> và <span style="font-weight: 600;">Privacy Policy URL</span> và kích hoạt ứng dụng bằng cách bật công tắc ở phía trên.</span>`,
      image2:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/8-2.png",
      text2: `<span class="xl:text-base text-xs">Bây giờ bạn sẽ nhận được <span style="font-weight: 600;">App ID</span> và <span style="font-weight: 600;">App Secret</span>. Sao chép <span style="font-weight: 600;">App ID</span> và <span style="font-weight: 600;">App Secret</span> của bạn và dán chúng vào các trường tương ứng trong phần cấu hình của module.</span>`,
    },
  ],

  postSchedule: [
    {
      tab: "schedule",
      content: [
        {
          title: "Bước 1: Chọn Post",
          text: "Chọn một bài đăng từ danh sách do AI tạo ra.",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620891/Chow/Schedule_step_1_swdz4i.png",
        },
        {
          title: "Bước 2: Nhập Nội Dung và image_url",
          text: "Thiết lập nội dung image_url",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620895/Chow/Schedule_step_2_xc1fdt.png",
        },
        {
          title: "Bước 3: Chọn Thời Gian và Thiết Lập Thời Gian",
          text: "Chọn thời gian và thiết lập thời gian",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620898/Chow/Schedule_step_3_wq2zcl.png",
        },
        {
          title: "Bước 4: Xác Nhận",
          text: "Xác nhận bài đăng đã lên lịch.",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620896/Chow/Schedule_step_4_tsabto.png",
        },
      ],
    },
    {
      tab: "view",
      content: [
        {
          title: "Bước 1: Chọn Trang",
          text: "Chọn một trang có bài đăng đã lên lịch trước đó",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620903/Chow/ViewSCheduledPost_step_1_pxh8sg.png",
        },
        {
          title: "Bước 2: Chọn Bài Post",
          text: "Chọn bài viết bạn muốn xem chi tiết",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620872/Chow/Update_Delete_step_1_acgygf.png",
        },
      ],
    },

    {
      tab: "update",
      content: [
        {
          title: "Bước 1: Chọn Bài Post",
          text: "Chọn một bài đăng từ lịch",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620872/Chow/Update_Delete_step_1_acgygf.png",
        },
        {
          title: "Bước 2: Cập nhập nội dung mới",
          text: "Enter nội dung mới để cập nhật",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620887/Chow/Delete_step_2_n17sgd.png",
        },
        {
          title: "Bước 3: Confirm ",
          text: "Click 'save changes' để lưu thay đổi",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620904/Chow/Update_Step_3_sbk6au.png",
        },
      ],
    },

    {
      tab: "delete",
      content: [
        {
          title: "Bước 1: Chọn Bài Post",
          text: "Chọn một bài đăng từ lịch",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620872/Chow/Update_Delete_step_1_acgygf.png",
        },
        {
          title: "Bước 2: Xác Nhận ",
          text: "Click 'Delete' để xóa bài đăng đã lên lịch",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620887/Chow/Delete_step_2_n17sgd.png",
        },
      ],
    },
  ],
};

export const contentMapEN: Record<
  "setting" | "postSchedule",
  StepData[] | SchedulePostViewData[]
> = {
  setting: [
    {
      step: 1,
      title: `setting.step1`,
      image:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/1a-1.png",
      text: `<span class="xl:text-base text-xs">To start with, navigate your browser to the <a style="color: blue; text-decoration: underline;" href="https://developers.facebook.com/" target="_blank">Facebook Developers page</a>. You’ll need to login to your Facebook account. Once logged in, you’ll see a screen similar to this.</span>`,
      text2: `<span class="xl:text-base text-xs">To begin, click on <span style="font-weight: 600;">Add a New App</span> link under the <span style="font-weight: 600;">My Apps</span> menu in the top right corner.</span>`,
    },
    {
      step: 2,
      title: `setting.step2`,
      image:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/2-5.png",
      text: `<span class="xl:text-base text-xs">Once you’ve clicked <span style="font-weight: 600;">Add a New App</span> link, a pop-up box will appear asking you for your new App’s Display Name, Contact E-Mail Address. Enter App’s Display Name and click on <span style="font-weight: 600;">Create App ID</span>.</span>`,
    },
    {
      step: 3,
      title: `setting.step3`,
      image:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/3-4.png",
      text: `<span class="xl:text-base text-xs">Now you have to add <span style="font-weight: 600;">Facebook Login</span> product in your app. And to do that click on <span style="font-weight: 600;">Set Up</span> button.</span>`,
      text2: `<span class="xl:text-base text-xs">After clicking on <span style="font-weight: 600;">Set Up</span> button you will be redirected to the <span style="font-weight: 600;">Quickstart</span> page. <br/> To get started, select the platform for this app. Now select <span style="font-weight: 600;">Web</span> platform for this app.</span>`,
      image2:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/4-4.png",
    },
    {
      step: 4,
      title: `setting.step4`,
      image:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/5-3.png",
      text: `<span class="xl:text-base text-xs">After clicking on <span style="font-weight: 600;">Web</span> a new tab will open. Now enter your site URL here and click <span style="font-weight: 600;">Save</span> button.</span>`,
      text2: `<span class="xl:text-base text-xs">After clicking on <span style="font-weight: 600;">Save</span> button, skip the remaining part. Now click on <span style="font-weight: 600;">Settings</span> in the left side menu list. <br/> Enter redirect URL here and then click <span style="font-weight: 600;">Save Changes</span> button to save the details.</span>`,
      image2:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/6-2.png",
    },
    {
      step: 5,
      title: `setting.step5`,
      image:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/7-1.png",
      text: `<span class="xl:text-base text-xs">For making your app live, you have to enter some more details. To do this, click on <span style="font-weight: 600;">Basic</span> tab under the <span style="font-weight: 600;">Settings</span> in the left side menu list. <br/>After clicking on <span style="font-weight: 600;">Basic</span> tab, you have to enter <span style="font-weight: 600;">App Domains</span> and <span style="font-weight: 600;">Privacy Policy URL</span> and make the app live by clicking the switch button on top.</span>`,
      image2:
        "https://cdnblog.webkul.com/blog/wp-content/uploads/2018/04/8-2.png",
      text2: `<span class="xl:text-base text-xs">Now you will get your <span style="font-weight: 600;">App ID</span> and <span style="font-weight: 600;">App Secret</span>. Copy your <span style="font-weight: 600;">App ID</span> and <span style="font-weight: 600;">App Secret</span> and paste them in the respective fields in the module configuration.</span>`,
    },
  ],

  postSchedule: [
    {
      tab: "schedule",
      content: [
        {
          title: "Step 1: Select Post",
          text: "Choose a post from the AI-generated list.",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620891/Chow/Schedule_step_1_swdz4i.png",
        },
        {
          title: "Step 2: Input content and image_url",
          text: "Set content and image_url",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620895/Chow/Schedule_step_2_xc1fdt.png",
        },
        {
          title: "Step 3: Choose page and set time",
          text: "Choose page and set time",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620898/Chow/Schedule_step_3_wq2zcl.png",
        },
        {
          title: "Step 4: Confirm",
          text: "Confirm the scheduled post.",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620896/Chow/Schedule_step_4_tsabto.png",
        },
      ],
    },
    {
      tab: "view",
      content: [
        {
          title: "Step 1: Select page",
          text: "Select a page with a previously scheduled post",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620903/Chow/ViewSCheduledPost_step_1_pxh8sg.png",
        },
        {
          title: "Step 2: Select a post",
          text: "Select the article you want to view details",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620872/Chow/Update_Delete_step_1_acgygf.png",
        },
      ],
    },

    {
      tab: "update",
      content: [
        {
          title: "Step 1: Choose a post ",
          text: "Select a post from the calendar",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620872/Chow/Update_Delete_step_1_acgygf.png",
        },
        {
          title: "Step 2: Update new content",
          text: "Enter new content to update",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620887/Chow/Delete_step_2_n17sgd.png",
        },
        {
          title: "Step 3: Confirm ",
          text: "Click 'save changes'to save changes",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620904/Chow/Update_Step_3_sbk6au.png",
        },
      ],
    },

    {
      tab: "delete",
      content: [
        {
          title: "Step 1: Choose a post ",
          text: "Select a post from the calendar",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620872/Chow/Update_Delete_step_1_acgygf.png",
        },
        {
          title: "Step 2: Confirm ",
          text: "Click 'Delete'to delete scheduled post",
          image:
            "https://res.cloudinary.com/thucdang/image/upload/v1744620887/Chow/Delete_step_2_n17sgd.png",
        },
      ],
    },
  ],
};
