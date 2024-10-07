import { Dispatch, SetStateAction } from "react";
import { useSelectedValues } from "../../HistoryContext";
import { useNavigate } from "react-router-dom";

interface IThingsListHeaderProps {
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

const ThingsListHeader = ({ setFilterThing }: IThingsListHeaderProps) => {
  const navigate = useNavigate();
  const onChangeStatus = (e: any) => {
    setFilterThing((prevState: any) => ({
      ...prevState,
      status: e.target.value,
    }));
  };

  const { selectedValues } = useSelectedValues();

  const openMessagingPage = () => {
    navigate("/history/device/list", { state: { selectedValues } });
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
                setFilterThing((prevState: any) => ({
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
          {selectedValues.length > 0 && (
            <>
              <div className="text-end">
                <span className="text-muted fw-bold mx-6">
                  <b> {selectedValues.length}</b> devices selected
                </span>
              </div>
              <div className="d-flex justify-content-end" data-kt-user-table-toolbar="base">
                <button type="button" className="btn btn-primary" onClick={openMessagingPage}>
                  Telemetry
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export { ThingsListHeader };
