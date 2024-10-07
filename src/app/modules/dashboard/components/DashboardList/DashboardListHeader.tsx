import { Dispatch, SetStateAction } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";

interface IDashboardListHeaderProps {
  onShowAddDashboard: () => void;
  setFilterDashboard: Dispatch<
    SetStateAction<{
      limit: number;
      offset: number;
      name: string;
      metadata: string;
      status: string;
    }>
  >;
}

const DashboardListHeader = ({ onShowAddDashboard, setFilterDashboard }: IDashboardListHeaderProps) => {
  const onChangeStatus = (e: any) => {
    setFilterDashboard((prevState: any) => ({
      ...prevState,
      status: e.target.value,
    }));
  };

  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          {/* begin::Search */}
          <div className="d-flex align-items-center position-relative my-1">
            <input
              type="text"
              className="form-control form-control form-control-lg mx-2"
              placeholder="Search"
              onChange={(e) =>
                setFilterDashboard((prevState: any) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
            />
            <select className="form-select form-select-solid w-200px ps-8" onChange={onChangeStatus} defaultValue={"enabled"}>
              <option value="all">Status: all</option>
              <option value="enabled">Status: enabled</option>
              <option value="disabled">Status: disabled</option>
            </select>
          </div>
          {/* end::Search */}
        </div>

        <div className="card-toolbar">
          <div className="d-flex justify-content-end" data-kt-dashboard-table-toolbar="base">
            <button type="button" className="btn btn-primary" onClick={onShowAddDashboard}>
              <KTIcon iconName="plus" className="fs-2" />
              Add Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export { DashboardListHeader };
