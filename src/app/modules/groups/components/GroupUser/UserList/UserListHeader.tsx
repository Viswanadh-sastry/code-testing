import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { getRolePermission, MODULENAME } from "../../../../auth/core/RoleHelpers";

interface IUserChannelListHeaderProps {
  tab: string;
  setTab: Dispatch<SetStateAction<string>>;
  setFilterUser: Dispatch<
    SetStateAction<{
      limit: number;
      offset: number;
      name: string;
      metadata: string;
      permission: string;
      status: string;
    }>
  >;
  onShowAddUser: () => void;
}

const UserListHeader = ({ setFilterUser, tab, setTab, onShowAddUser }: IUserChannelListHeaderProps) => {
  const params = useParams();
  const id = params.id as string;
  const [rolePermission, setRolePermission] = useState<any>(null);

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.ASSETGROUPMEMBER, id);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setFilterUser((prevState) => ({
      ...prevState,
      permission: newTab,
    }));
  };

  return (
    <>
      <div className="card card-custom">
        <div className="card-header card-header-stretch overflow-auto">
          <ul className="nav nav-stretch nav-line-tabs fs-5 fw-bolder border-transparent flex-nowrap" role="tablist">
            <li className="nav-item">
              <a className={clsx(`nav-link text-active-primary me-6 cursor-pointer`, { active: tab === "" })} onClick={() => handleTabChange("")} role="tab">
                All
              </a>
            </li>

            {rolePermission?.admin && (
              <li className="nav-item">
                <a
                  className={clsx(`nav-link text-active-primary me-6 cursor-pointer`, { active: tab === "administrator" })}
                  onClick={() => handleTabChange("administrator")}
                  role="tab"
                >
                  Administrator
                </a>
              </li>
            )}

            {(rolePermission?.admin || rolePermission?.editor) && (
              <li className="nav-item">
                <a className={clsx(`nav-link text-active-primary me-6 cursor-pointer`, { active: tab === "editor" })} onClick={() => handleTabChange("editor")} role="tab">
                  Editor
                </a>
              </li>
            )}

            <li className="nav-item">
              <a className={clsx(`nav-link text-active-primary me-6 cursor-pointer`, { active: tab === "viewer" })} onClick={() => handleTabChange("viewer")} role="tab">
                Viewer
              </a>
            </li>
          </ul>

          {rolePermission?.create && (
            <button type="button" className="btn btn-primary my-4" onClick={onShowAddUser}>
              <KTIcon iconName="plus" className="fs-2" />
              Add Member
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export { UserListHeader };
