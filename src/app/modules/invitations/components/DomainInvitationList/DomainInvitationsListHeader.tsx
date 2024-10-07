import { Dispatch, SetStateAction } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";
import * as roleHelper from "../../../auth/core/RoleHelpers";

interface IDomainInvitationsListHeaderProps {
  onShowInviteUser: () => void;
  setFilterInvitation: Dispatch<
    SetStateAction<{
      limit: number;
      offset: number;
      invited_by: string;
      domain_id: string;
      user_id: string;
      relation: string;
      state: string;
    }>
  >;
}

const DomainInvitationsListHeader = ({ onShowInviteUser, setFilterInvitation }: IDomainInvitationsListHeaderProps) => {
  const role = roleHelper.getRole();
  const onChangeStatus = (e: any) => {
    setFilterInvitation((prevState: any) => ({
      ...prevState,
      state: e.target.value,
    }));
  };

  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          {/* begin::Search */}
          <div className="d-flex align-items-center position-relative my-1">
            <select className="form-select form-select-solid w-200px ps-8" onChange={onChangeStatus} defaultValue="pending">
              <option value="all">State: all</option>
              <option value="pending">State: pending</option>
              <option value="accepted">State: accepted</option>
            </select>
          </div>
          {/* end::Search */}
        </div>

        <div className="card-toolbar">
          <div className="d-flex justify-content-end" data-kt-invitation-table-toolbar="base">
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

            {role !== "viewer" && (
              <button type="button" className="btn btn-primary" onClick={onShowInviteUser}>
                <KTIcon iconName="plus" className="fs-2" />
                Invite User
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { DomainInvitationsListHeader };
