import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { DashboardList } from "./components/DashboardList/DashboardList";
import { ViewDashboard } from "./components/AddEditDashboard/ViewDashboard";
import { LayoutBuilder } from "./components/AddEditDashboard/LayoutBuilder";

const channelBreadCrumbs: Array<PageLink> = [
  {
    title: "Home",
    path: `/home`,
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

const DashboardPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path=":id/view"
          element={
            <>
              <PageTitle breadcrumbs={channelBreadCrumbs}>View Dashboard</PageTitle>
              <ViewDashboard />
            </>
          }
        />
        <Route
          path=":id/layout"
          element={
            <>
              <PageTitle breadcrumbs={channelBreadCrumbs}>Layout Builder</PageTitle>
              <LayoutBuilder />
            </>
          }
        />
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={channelBreadCrumbs}>Dashboard List</PageTitle>
              <DashboardList />
            </>
          }
        />
        <Route index element={<Navigate to="/dashboard/list" />} />
      </Route>
    </Routes>
  );
};

export default DashboardPage;
