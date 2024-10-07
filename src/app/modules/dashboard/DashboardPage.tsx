import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { DashboardList } from "./components/DashboardList/DashboardList";
import { EditDashboard } from "./components/AddEditDashboard/EditDashboard";

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
          path="edit/:id"
          element={
            <>
              <PageTitle breadcrumbs={channelBreadCrumbs}>Edit Dashboard</PageTitle>
              <EditDashboard />
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
