import clsx from "clsx";
import { Dispatch, FC, SetStateAction } from "react";

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
}

const UserListHeader: FC<IUserChannelListHeaderProps> = ({ setFilterUser, tab, setTab }) => {
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
              <a className={clsx(`nav-link text-active-primary me-6 cursor-pointer`, { active: tab === "admin" })} onClick={() => handleTabChange("admin")} role="tab">
                All
              </a>
            </li>

            <li className="nav-item">
              <a
                className={clsx(`nav-link text-active-primary me-6 cursor-pointer`, { active: tab === "administrator" })}
                onClick={() => handleTabChange("administrator")}
                role="tab"
              >
                Administrator
              </a>
            </li>
          </ul>

          {/* <div className="card-header border-0 pt-6 mb-1">
            <div className="card-toolbar">
              <div className="d-flex justify-content-end" data-kt-user-table-toolbar="base">
                <button type="button" className="btn btn-primary" onClick={onShowAddUser}>
                  <KTIcon iconName="plus" className="fs-2" />
                  Add User
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export { UserListHeader };
