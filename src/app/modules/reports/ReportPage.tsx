import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { Overview } from "./components/Overview";
import { Settings } from "./components/Settings";

const reportBreadCrumbs: Array<PageLink> = [
  {
    title: "Home",
    path: "/home",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "",
    path: "",
    isSeparator: true,
    isActive: false,
  },
];

const ReportPage: React.FC = () => {
  return (
    <Routes>
      <Route
        element={
          <>
            <Outlet />
          </>
        }
      >
        <Route
          path="overview"
          element={
            <>
              <PageTitle breadcrumbs={reportBreadCrumbs}>Report</PageTitle>
              <Overview />
            </>
          }
        />
        <Route
          path="settings"
          element={
            <>
              <PageTitle breadcrumbs={reportBreadCrumbs}>Settings</PageTitle>
              <Settings />
            </>
          }
        />
        <Route index element={<Navigate to="/report/overview" />} />
      </Route>
    </Routes>
  );
};

export default ReportPage;
