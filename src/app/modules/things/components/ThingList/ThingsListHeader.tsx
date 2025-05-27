import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";
import { getRolePermission, MODULENAME } from "../../../auth/core/RoleHelpers";

interface IThingsListHeaderProps {
  onShowAddThing: () => void;
  onShowImportThing: () => void;
  setFilterThing: Dispatch<
    SetStateAction<{
      limit: number;
      status: string;
      sort_by: string;
    }>
  >;
  filterThing: {
    limit: number;
    status: string;
    sort_by: string;
  };
}

const ThingsListHeader = ({
  onShowAddThing,
  onShowImportThing,
  setFilterThing,
  filterThing,
}: IThingsListHeaderProps) => {
  const [rolePermission, setRolePermission] = useState<any>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.DEVICELIST);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);

  const onChangeStatus = (e: any) => {
    setFilterThing((prevState: any) => ({
      ...prevState,
      status: e.target.value,
    }));
  };

  const onSelectSort = (sortKey: string) => {
    setFilterThing((prev) => ({
      ...prev,
      sort_by: sortKey,
    }));
    setShowSortDropdown(false);
  };

  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          {/* Search and Status */}
          <div className="d-flex align-items-center position-relative my-1">
            <input
              type="text"
              className="form-control form-control-lg mx-2"
              placeholder="Search"
              onChange={(e) =>
                setFilterThing((prevState: any) => ({
                  ...prevState,
                }))
              }
            />
            <select
              className="form-select form-select-solid w-200px ps-8"
              onChange={onChangeStatus}
              defaultValue={"enabled"}
            >
              <option value="all">Status: all</option>
              <option value="enabled">Status: enabled</option>
              <option value="disabled">Status: disabled</option>
            </select>
          </div>
        </div>

        <div className="card-toolbar">
          <div className="d-flex justify-content-end" data-kt-thing-table-toolbar="base">
            {rolePermission?.create && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onShowAddThing}
                >
                  <KTIcon iconName="plus" className="fs-2" />
                  Add Device
                </button>

                <button
                  type="button"
                  className="btn btn-light-primary mx-2"
                  onClick={onShowImportThing}
                >
                  <KTIcon iconName="exit-up" className="fs-2" />
                  Import
                </button>
              </>
            )}

            {/* Export Button */}
            <button
              type="button"
              className="btn btn-light-primary me-2"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
            >
              <KTIcon iconName="exit-down" className="fs-2" />
              Export
            </button>

            {/* Sort Button + Dropdown */}
            <div className="position-relative">
              <button
                type="button"
                className="btn btn-light-primary"
                onClick={() => setShowSortDropdown((prev) => !prev)}
              >
                <KTIcon iconName="Sort" className="fs-2" />
                Sort
              </button>

              {showSortDropdown && (
                <div
                  className="menu menu-sub menu-sub-dropdown show position-absolute end-0 mt-2"
                  style={{ zIndex: 1000, minWidth: "220px" }}
                >
                  <div className="menu-item px-3" onClick={() => onSelectSort("name")}>
                    <span className="menu-link px-3">Sort by Name (A–Z)</span>
                  </div>
                  <div className="menu-item px-3" onClick={() => onSelectSort("name_desc")}>
                    <span className="menu-link px-3">Sort by Name (Z–A)</span>
                  </div>
                  <div className="menu-item px-3" onClick={() => onSelectSort("created_at")}>
                    <span className="menu-link px-3">Sort by Created At (Oldest First)</span>
                  </div>
                  <div className="menu-item px-3" onClick={() => onSelectSort("created_at_desc")}>
                    <span className="menu-link px-3">Sort by Created At (Newest First)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { ThingsListHeader };
