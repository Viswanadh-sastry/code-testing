import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { ProfileTab } from "./components/ProfileTab";

const profileBreadCrumbs: Array<PageLink> = [
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

const ProfilePage = () => (
  <Routes>
    <Route
      element={
        <>
          <Outlet />
        </>
      }
    >
      <Route
        path="edit"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Edit Profile</PageTitle>
            <ProfileTab />
          </>
        }
      />
      <Route index element={<Navigate to="/profile/edit" />} />
    </Route>
  </Routes>
);

export default ProfilePage;
