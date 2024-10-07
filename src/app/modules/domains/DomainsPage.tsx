import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { DomainTable } from "../domain/components/DomainList/DomainTable";
import { MembersTable } from "./components/Members/MemberList/MembersTable";
import { ViewDomain } from "./components/ViewDomain/ViewDomain";
import { ViewMember } from "./components/Members/ViewMember/ViewMember";
import { getDomain } from "../auth/core/DomainHelpers";

const OrganizationPage = () => {
  const { name } = getDomain();
  const organizationBreadCrumbs: Array<PageLink> = [
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
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path=":id/view"
          element={
            <>
              <PageTitle breadcrumbs={organizationBreadCrumbs}>{name}</PageTitle>
              <ViewDomain />
            </>
          }
        />
        <Route
          path=":id/members"
          element={
            <>
              <PageTitle breadcrumbs={organizationBreadCrumbs}>Member List</PageTitle>
              <MembersTable />
            </>
          }
        />
        <Route
          path=":id/members/:userId"
          element={
            <>
              <PageTitle breadcrumbs={organizationBreadCrumbs}>View Member</PageTitle>
              <ViewMember />
            </>
          }
        />
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={organizationBreadCrumbs}>Organization List</PageTitle>
              <DomainTable />
            </>
          }
        />
        <Route index element={<Navigate to={`/domains/list`} />} />
      </Route>
    </Routes>
  );
};

export default OrganizationPage;
