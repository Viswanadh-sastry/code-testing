import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { useNavigate } from "react-router-dom";
import { getThingListAll } from "../../../things/api/ThingAPI";
import { useSelectedValues } from "../../HistoryContext";

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
  const filterThing = {
    limit: 100,
    offset: 0,
    name: "",
    metadata: "",
    tags: "",
    status: "enabled",
  };

  const thingListQuery = useQuery({
    queryKey: [`thingList`, filterThing],
    queryFn: async () => getThingListAll(filterThing),
    enabled: true,
  });

  // Get all unique device types
  const deviceTypeList = Array.from(
    new Set(
      (thingListQuery.data?.things.flatMap((thing: any) => thing.metadata?.Device_Type) || [])
        .filter((deviceType: string | undefined) => deviceType)
        .map((deviceType: string) => deviceType.trim())
    )
  ).map((deviceType) => ({ label: deviceType }));

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
              className="form-control form-control form-control-lg w-300px"
              placeholder="Search"
              onChange={(e) =>
                setFilterThing((prevState: any) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
            />
            <Typeahead
              id="deviceTypeList"
              labelKey="label"
              className="fw-bolder mx-2 w-200px"
              onChange={(selected) => {
                const selectedNames = selected.filter((option) => typeof option === "object" && option !== null).map((option: any) => option.label);
                setFilterThing((prevState: any) => ({
                  ...prevState,
                  metadata: selectedNames.length > 0 ? `{"Device_Type": "${selectedNames[0]}"}` : "",
                }));
              }}
              options={deviceTypeList}
              placeholder="Device Type"
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
