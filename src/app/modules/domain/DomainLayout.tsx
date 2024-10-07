import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { HeaderWrapper } from "../../../_metronic/layout/components/header";
import { ScrollTop } from "../../../_metronic/layout/components/scroll-top";
import { FooterWrapper } from "../../../_metronic/layout/components/footer";
import { Sidebar } from "./sidebar";
import { ActivityDrawer, DrawerMessenger } from "../../../_metronic/partials";
import { Content } from "../../../_metronic/layout/components/content";
import { PageDataProvider } from "../../../_metronic/layout/core";
import { reInitMenu } from "../../../_metronic/helpers";

const DomainLayout = () => {
  const location = useLocation();
  useEffect(() => {
    reInitMenu();
  }, [location.key]);

  return (
    <PageDataProvider>
      <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
        <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
          <HeaderWrapper />
          <div className="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
            <Sidebar />
            <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
              <div className="d-flex flex-column flex-column-fluid">
                <Content>
                  <Outlet />
                </Content>
              </div>
              <FooterWrapper />
            </div>
          </div>
        </div>
      </div>

      {/* begin:: Drawers */}
      <ActivityDrawer />
      <DrawerMessenger />
      {/* end:: Drawers */}

      {/* begin:: Modals */}
      {/* <InviteUsers />
      <UpgradePlan /> */}
      {/* end:: Modals */}
      <ScrollTop />
    </PageDataProvider>
  );
};

export { DomainLayout };
