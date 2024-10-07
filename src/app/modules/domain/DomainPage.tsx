import { FC, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";
import { getCSSVariableValue } from "../../../_metronic/assets/ts/_utils";
import { WithChildren } from "../../../_metronic/helpers";
import BuilderPageWrapper from "../../pages/layout-builder/BuilderPageWrapper";
import { ProfileTab } from "../profile/components/ProfileTab";
import { DomainLayout } from "./DomainLayout";
import { DomainTable } from "./components/DomainList/DomainTable";
import { InvitationsTable } from "../invitations/components/InvitationList/InvitationsTable";
import { PageTitle } from "../../../_metronic/layout/core";

const DomainPage = () => (
  <Routes>
    <Route element={<DomainLayout />}>
      <Route
        path="builder"
        element={
          <SuspensedView>
            <BuilderPageWrapper />
          </SuspensedView>
        }
      />
      <Route
        path="profile"
        element={
          <SuspensedView>
            <ProfileTab />
          </SuspensedView>
        }
      />
      <Route
        path="list"
        element={
          <>
            <PageTitle>Organization List</PageTitle>
            <DomainTable />
          </>
        }
      />
      <Route
        path="invitation"
        element={
          <>
            <PageTitle>Invitation List</PageTitle>
            <InvitationsTable />
          </>
        }
      />
      <Route index element={<DomainTable />} />
    </Route>
  </Routes>
);

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue("--bs-primary");
  TopBarProgress.config({
    barColors: {
      "0": baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { DomainPage };
