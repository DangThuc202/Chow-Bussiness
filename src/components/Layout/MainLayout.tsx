// components
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const MainLayout = () => {
  return (
    <div className="relative w-screen h-screen flex ">
      <SideBar />
      <div className="xl:ml-0 flex-1 h-auto bg-[#e5e7eb] p-4 overflow-x-hidden overflow-y-clip text-primary-black">
        <div className="bg-white py-2 px-8 rounded-md h-full w-full overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
