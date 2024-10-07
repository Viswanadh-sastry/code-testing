import { useEffect, useState } from "react";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { getRolePermission, MODULENAME } from "../../../../auth/core/RoleHelpers";

interface IMembersListHeaderProps {
  onShowAddMember: () => void;
  // setFilterMember: Dispatch<
  //   SetStateAction<{
  //     limit: number;
  //     offset: number;
  //     metadata: string;
  //     status: string;
  //   }>
  // >;
}

const MembersListHeader = ({ onShowAddMember }: IMembersListHeaderProps) => {
  const [rolePermission, setRolePermission] = useState<any>(null);

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.MEMBERLIST);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);

  // const onChangeStatus = (e: any) => {
  //   setFilterMember((prevState: any) => ({
  //     ...prevState,
  //     status: e.target.value,
  //   }));
  // };

  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          {/* begin::Search */}
          <div className="d-flex align-items-center position-relative my-1">
            Members
            {/* <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" /> */}
            {/* <input
              type="text"
              data-kt-member-table-filter="search"
              className="form-control  w-250px ps-14"
              placeholder="Search member"
              //   value={searchTerm}
              //   onChange={(e) => setSearchTerm(e.target.value)}
            /> */}
            {/* <select className="form-select form-select-solid w-200px ps-8" onChange={onChangeStatus} defaultValue="enabled">
              <option value="all">Status: all</option>
              <option value="enabled">Status: enabled</option>
              <option value="disabled">Status: disabled</option>
            </select> */}
          </div>
          {/* end::Search */}
        </div>

        <div className="card-toolbar">
          <div className="d-flex justify-content-end" data-kt-member-table-toolbar="base">
            {/* <button type="button" className="btn btn-light-primary me-3" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
              <KTIcon iconName="exit-down" className="fs-2" />
              Export
            </button>
            <div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4" data-kt-menu="true">
              <div className="menu-item px-3">
                <a className="menu-link px-3">XLSX File</a>
              </div>
              <div className="menu-item px-3">
                <a className="menu-link px-3">CSV File</a>
              </div>
              <div className="menu-item px-3">
                <a className="menu-link px-3">PDF File</a>
              </div>
              <div className="menu-item px-3">
                <a className="menu-link px-3">DOCX File</a>
              </div>
            </div> */}

            {rolePermission?.create && (
              <button type="button" className="btn btn-primary" onClick={onShowAddMember}>
                <KTIcon iconName="plus" className="fs-2" />
                Assign User
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { MembersListHeader };
