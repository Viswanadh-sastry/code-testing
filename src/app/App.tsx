import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { I18nProvider } from "../_metronic/i18n/i18nProvider";
import { LayoutProvider, LayoutSplashScreen } from "../_metronic/layout/core";
import { MasterInit } from "../_metronic/layout/MasterInit";
import { ThemeModeProvider } from "../_metronic/partials";
import { AuthInit } from "./modules/auth";
import "react-toastify/dist/ReactToastify.css";
import "sweetalert2/dist/sweetalert2.min.css";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LayoutSplashScreen />}>
        <I18nProvider>
          <LayoutProvider>
            <ThemeModeProvider>
              <AuthInit>
                <Outlet />
                <MasterInit />
                <ToastContainer />
              </AuthInit>
            </ThemeModeProvider>
          </LayoutProvider>
        </I18nProvider>
      </Suspense>
    </QueryClientProvider>
  );
};

export { App };
