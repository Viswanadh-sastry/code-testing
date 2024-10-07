import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { getRolePermission, MODULENAME } from "../../../../auth/core/RoleHelpers";

interface IThingsListHeaderProps {
  onShowAddThing: () => void;
  setFilterThing: Dispatch<
    SetStateAction<{
      limit: number;
      offset: number;
      name: string;
      metadata: string;
      tags: string;
      status: string;
    }>
  >;
}

const ThingsListHeader = ({ onShowAddThing, setFilterThing }: IThingsListHeaderProps) => {
  const params = useParams();
  const id = params.id as string;
  const [rolePermission, setRolePermission] = useState<any>(null);

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.ASSETGROUP, id);
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

  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          <div className="mx-2">
            <input
              type="text"
              className="form-control form-control form-control-lg"
              placeholder="Search"
              onChange={(e) =>
                setFilterThing((prevState: any) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
            />
          </div>

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

          {rolePermission?.create && (
            <div className="d-flex justify-content-end" data-kt-thing-table-toolbar="base">
              <button type="button" className="btn btn-primary" onClick={onShowAddThing}>
                <KTIcon iconName="plus" className="fs-2" />
                Add Device
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { ThingsListHeader };
