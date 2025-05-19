import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import i18n from "./i18n/index";
import { I18nextProvider } from "react-i18next";
import { LanguageProvider } from "./contexts/LanguagesContext";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <LanguageProvider>
            <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={8}
              toastOptions={{
                duration: 5000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                },
              }}
            />
            <App />
          </LanguageProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </AuthContextProvider>
);
