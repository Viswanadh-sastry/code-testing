import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarMenuMain = () => {
  return (
    <>
      <div className="menu-item">
        <div className="menu-content pt-2 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">Organizations Management</span>
        </div>
      </div>
      <SidebarMenuItem to="/domain/list" title="Organizations" icon="office-bag" />
      <SidebarMenuItem to="/domain/invitation" title="Invitations" icon="sms" />
    </>
  );
};

export { SidebarMenuMain };
