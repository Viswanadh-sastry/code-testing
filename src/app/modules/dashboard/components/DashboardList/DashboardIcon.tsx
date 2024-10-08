import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Row, useTable } from "react-table";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getDashboardList } from "../../api/DashboardAPI";
import { Dashboard } from "../../api/_models";
import { AddDashboard } from "../AddEditDashboard/AddDashboard";
import { DashboardListHeader } from "./DashboardListHeader";
import { dashboardColumns } from "./columns/_columns";
import { DashboardListLoading } from "./pagination/DashboardListLoading";
// import { DashboardListPagination } from "./pagination/DashboardListPagination";
import { Card4 } from "../../../../../_metronic/partials/content/cards/Card4";

const DashboardIcon = () => {
  const [view, setView] = useState("icon");
  const [showAddDashboard, setShowAddDashboard] = useState(false);
  const [filterDashboard, setFilterDashboard] = useState({
    limit: 100,
    page: 1,
    name: "",
  });

  const dashboardListQuery = useQuery({
    queryKey: [`dashboardList`, filterDashboard],
    queryFn: async () => getDashboardList(filterDashboard),
  });
  const isLoading = dashboardListQuery.isLoading;
  const data = useMemo(() => dashboardListQuery.data?.dashboards || [], [dashboardListQuery.data]);
  const columns = useMemo(() => dashboardColumns, []);
  const { rows } = useTable({
    columns,
    data,
  });

  const onGetDashboardList = () => {
    dashboardListQuery.refetch();
  };

  const onShowAddDashboard = () => {
    setShowAddDashboard(true);
  };

  const onCloseAddDashboard = () => {
    setShowAddDashboard(false);
  };

  console.log("dashboardListQuery", dashboardListQuery);

  return (
    <KTCard>
      <DashboardListHeader view={view} setView={setView} onShowAddDashboard={onShowAddDashboard} setFilterDashboard={setFilterDashboard} />
      <KTCardBody className="py-4">
        <div className="row">
          {rows.map((row: Row<Dashboard>) => {
            return (
              <div className="col-12 col-xl-2 col-lg-3 col-md-4 mb-5" key={row.original.id}>
                <Card4
                  id={row.original.id}
                  url={`/dashboard/${row.original.id}/view`}
                  icon="media/svg/files/folder-document.svg"
                  title={row.original.name}
                  description={row.original.description}
                  onGetDashboardList={onGetDashboardList}
                />
              </div>
            );
          })}
        </div>
        {/* <DashboardListPagination filterDashboard={filterDashboard} setFilterDashboard={setFilterDashboard} /> */}
        {showAddDashboard && <AddDashboard onCloseAddDashboard={onCloseAddDashboard} onGetDashboardList={onGetDashboardList} />}
        {isLoading && <DashboardListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { DashboardIcon };
