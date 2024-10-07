import clsx from "clsx";
import { FC, useState } from "react";
import { ChangePassword } from "./ChangePassword";
import { MyProfile } from "./MyProfile";

const ProfileTab: FC = () => {
  const [tab, setTab] = useState("myProfile");

  return (
    <>
      <div className="card card-custom">
        <div className="card-header card-header-stretch overflow-auto">
          <ul className="nav nav-stretch nav-line-tabs fs-5 fw-bolder border-transparent flex-nowrap" role="tablist">
            <li className="nav-item">
              <a className={clsx(`nav-link text-active-primary me-6 cursor-pointer`, { active: tab === "myProfile" })} onClick={() => setTab("myProfile")} role="tab">
                My Profile
              </a>
            </li>

            <li className="nav-item">
              <a className={clsx(`nav-link text-active-primary me-6 cursor-pointer`, { active: tab === "changePassword" })} onClick={() => setTab("changePassword")} role="tab">
                Change Password
              </a>
            </li>
          </ul>
        </div>

        <div className="tab-content pt-3">
          <div className={clsx("tab-pane", { active: tab === "myProfile" })}>
            <MyProfile />
          </div>
          <div className={clsx("tab-pane", { active: tab === "changePassword" })}>
            <ChangePassword />
          </div>
        </div>
      </div>
    </>
  );
};

export { ProfileTab };
