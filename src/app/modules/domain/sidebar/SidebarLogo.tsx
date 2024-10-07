import { Link } from "react-router-dom";
import clsx from "clsx";
import { KTIcon, toAbsoluteUrl } from "../../../../_metronic/helpers";
import { useLayout } from "../../../../_metronic/layout/core";
import { MutableRefObject, useEffect, useRef } from "react";
import { ToggleComponent } from "../../../../_metronic/assets/ts/components";
import { ThemeModeComponent } from "../../../../_metronic/assets/ts/layout";

type PropsType = {
  sidebarRef: MutableRefObject<HTMLDivElement | null>;
};

const SidebarLogo = (props: PropsType) => {
  const { config } = useLayout();
  const toggleRef = useRef<HTMLDivElement>(null);
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }

  const appSidebarDefaultMinimizeDesktopEnabled = config?.app?.sidebar?.default?.minimize?.desktop?.enabled;
  const appSidebarDefaultCollapseDesktopEnabled = config?.app?.sidebar?.default?.collapse?.desktop?.enabled;
  const toggleType = appSidebarDefaultCollapseDesktopEnabled ? "collapse" : appSidebarDefaultMinimizeDesktopEnabled ? "minimize" : "";
  const toggleState = appSidebarDefaultMinimizeDesktopEnabled ? "active" : "";
  const appSidebarDefaultMinimizeDefault = config.app?.sidebar?.default?.minimize?.desktop?.default;

  useEffect(() => {
    setTimeout(() => {
      const toggleObj = ToggleComponent.getInstance(toggleRef.current!) as ToggleComponent | null;

      if (toggleObj === null) {
        return;
      }

      // Add a class to prevent sidebar hover effect after toggle click
      toggleObj.on("kt.toggle.change", function () {
        // Set animation state
        props.sidebarRef.current!.classList.add("animating");

        // Wait till animation finishes
        setTimeout(function () {
          // Remove animation state
          props.sidebarRef.current!.classList.remove("animating");
        }, 300);
      });
    }, 600);
  }, [toggleRef, props.sidebarRef]);

  return (
    <div className="app-sidebar-logo px-6" id="kt_app_sidebar_logo">
      <Link to="/home">
        {ktThemeModeValue === "light" ? (
          <img alt="Logo" src={toAbsoluteUrl("media/logos/honeycomb_light.png")} className="h-55px app-sidebar-logo-default" />
        ) : (
          <img alt="Logo" src={toAbsoluteUrl("media/logos/honeycomb_dark.png")} className="h-55px app-sidebar-logo-default" />
          // <>
          //   <img alt="Logo" src={toAbsoluteUrl("media/logos/favicon.png")} className="h-25px app-sidebar-logo-default theme-light-show" />
          //   <img alt="Logo" src={toAbsoluteUrl("media/logos/honeycomb_light.png")} className="h-55px app-sidebar-logo-default theme-dark-show" />
          // </>
        )}

        <img alt="Logo" src={toAbsoluteUrl("media/logos/favicon.png")} className="h-30px app-sidebar-logo-minimize" />
      </Link>

      {(appSidebarDefaultMinimizeDesktopEnabled || appSidebarDefaultCollapseDesktopEnabled) && (
        <div
          ref={toggleRef}
          id="kt_app_sidebar_toggle"
          className={clsx(
            "app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary h-30px w-30px position-absolute top-50 start-100 translate-middle rotate",
            { active: appSidebarDefaultMinimizeDefault }
          )}
          data-kt-toggle="true"
          data-kt-toggle-state={toggleState}
          data-kt-toggle-target="body"
          data-kt-toggle-name={`app-sidebar-${toggleType}`}
        >
          <KTIcon iconName="black-left-line" className="fs-3 rotate-180 ms-1" />
        </div>
      )}
    </div>
  );
};

export { SidebarLogo };
