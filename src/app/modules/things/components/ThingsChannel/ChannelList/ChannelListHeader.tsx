import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { getRolePermission, MODULENAME } from "../../../../auth/core/RoleHelpers";
import { useParams } from "react-router-dom";

interface IChannelsListHeaderProps {
  onShowAddChannel: () => void;
  setFilterChannel: Dispatch<
    SetStateAction<{
      limit: number;
      offset: number;
      name: string;
      metadata: string;
      status: string;
    }>
  >;
  totalChannel: number;
}

const ChannelListHeader = ({ onShowAddChannel, setFilterChannel, totalChannel }: IChannelsListHeaderProps) => {
  const params = useParams();
  const id = params.id as string;
  const [rolePermission, setRolePermission] = useState<any>(null);

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.DEVICECONNECT, id);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);

  const onChangeStatus = (e: any) => {
    setFilterChannel((prevState: any) => ({
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
            <select className="form-select form-select-solid w-200px ps-8" onChange={onChangeStatus} defaultValue={"enabled"}>
              <option value="all">Status: all</option>
              <option value="enabled">Status: enabled</option>
              <option value="disabled">Status: disabled</option>
            </select>
          </div>
          {/* end::Search */}
        </div>

        <div className="card-toolbar">
          <button type="button" className="btn btn-light mx-2" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
          {rolePermission?.create && totalChannel === 0 && (
            <div className="d-flex justify-content-end" data-kt-channel-table-toolbar="base">
              <button type="button" className="btn btn-primary" onClick={onShowAddChannel}>
                <KTIcon iconName="plus" className="fs-2" />
                Add Asset
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { ChannelListHeader };
