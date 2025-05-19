import { useContext } from "react";
import { StateContext } from "./contexts/StateContext";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import { Spin } from "antd";
import HomePage from "./pages/HomePage";
import AIContentPage from "./pages/AIContentPage";
import SettingPage from "./pages/SettingPage";
import TrafficGrowCenterPage from "./pages/TrafficGrowCenterPage";
import PostSchedulePage from "./pages/PostSchedulePage";
import MainLayout from "./components/Layout/MainLayout";
import MediaManagementPage from "./pages/MediaManagementPage";
import AICanvasPage from "./pages/AICanvasPage";
import ProfilePage from "./pages/ProfilePage";

const mainRoutes = [
  {
    path: "/",
    element: <HomePage />,
    key: "home",
  },
  {
    path: "/ai_content_creation",
    element: <AIContentPage />,
    key: "ai_content_creation",
  },
  {
    path: "/affiliate_management",
    element: <TrafficGrowCenterPage />,
    key: "affiliate_management",
  },
  {
    path: "/setting",
    element: <SettingPage />,
    key: "setting",
  },
  {
    path: "/social-media/social-post-scheduler",
    element: <PostSchedulePage />,
    key: "post-schedule",
  },
  {
    path: "/social-media/social-media-manager",
    element: <MediaManagementPage />,
    key: "media-management",
  },
  {
    path: "/AI-canvas",
    element: <AICanvasPage />,
    key: "AI-canvas",
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    key: "profile",
  },
];

function App() {
  const { loading } = useContext(StateContext);

  return (
    <div style={{ position: "relative" }}>
      <>
        <Routes>
          <Route key={"not-found"} path={"*"} element={<NotFoundPage />} />
          {mainRoutes.map(() => (
            <Route element={<MainLayout />}>
              {mainRoutes.map((item) => (
                <Route key={item.key} path={item.path} element={item.element} />
              ))}
            </Route>
          ))}
        </Routes>
        {loading && (
          <div>
            <Spin />
          </div>
        )}
      </>
    </div>
  );
}

export default App;
