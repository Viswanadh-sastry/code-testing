import { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { getRolePermission, MODULENAME } from "../auth/core/RoleHelpers";
import { DomainInvitationsTable } from "./components/DomainInvitationList/DomainInvitationsTable";
import { InvitationsTable } from "./components/InvitationList/InvitationsTable";

const invitationBreadCrumbs: Array<PageLink> = [
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

const InvitationPage = () => {
  const [rolePermission, setRolePermission] = useState<any>(null);

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.ORGANIZATIONINVITATION);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);

  return (
    <Routes>
      <Route element={<Outlet />}>
        {rolePermission?.menu && (
          <Route
            path=":id"
            element={
              <>
                <PageTitle breadcrumbs={invitationBreadCrumbs}>Organization Invitations</PageTitle>
                <DomainInvitationsTable />
              </>
            }
          />
        )}
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={invitationBreadCrumbs}>Invitation List</PageTitle>
              <InvitationsTable />
            </>
          }
        />
        <Route index element={<Navigate to="/invitations/list" />} />
      </Route>
    </Routes>
  );
};

export default InvitationPage;
