import { useQuery } from "@tanstack/react-query";
import "jspdf-autotable";
import { Dispatch, SetStateAction } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { useNavigate } from "react-router-dom";
import { getChannelListAll } from "../../../channels/api/ChannelsAPI";
import { useSelectedValues } from "../../HistoryContext";

interface IChannelsListHeaderProps {
  setFilterChannel: Dispatch<
    SetStateAction<{
      limit: number;
      offset: number;
      name: string;
      metadata: string;
      status: string;
    }>
  >;
}

const ChannelsListHeader = ({ setFilterChannel }: IChannelsListHeaderProps) => {
  const navigate = useNavigate();

  const filterChannel = {
    limit: 100,
    offset: 0,
    name: "",
    metadata: "",
    status: "enabled",
  };

  // only call getChannelList api when the component is mounted
  const channelListQuery = useQuery({
    queryKey: [`channelList`, filterChannel],
    queryFn: async () => getChannelListAll(filterChannel),
    enabled: true,
  });

  // Get all unique asset types
  const assetTypeList = Array.from(
    new Set(
      (channelListQuery.data?.groups.flatMap((channel: any) => channel.metadata?.Asset_Type) || [])
        .filter((assetType: string | undefined) => assetType) // Filter out undefined, null, or empty asset types
        .map((assetType: string) => assetType.trim()) // Normalize asset types by trimming and converting to lowercase
    )
  ).map((assetType) => ({ label: assetType }));

  const onChangeStatus = (e: any) => {
    setFilterChannel((prevState: any) => ({
      ...prevState,
      status: e.target.value,
    }));
  };

  const { selectedValues } = useSelectedValues();

  const openMessagingPage = () => {
    navigate("/history/asset/list", { state: { selectedValues } });
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
                setFilterChannel((prevState: any) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
            />
            <Typeahead
              id="assetTypeList"
              labelKey="label"
              className="fw-bolder mx-2 w-200px"
              onChange={(selected) => {
                const selectedNames = selected.filter((option) => typeof option === "object" && option !== null).map((option: any) => option.label);
                setFilterChannel((prevState: any) => ({
                  ...prevState,
                  metadata: selectedNames.length > 0 ? `{"Asset_Type": "${selectedNames[0]}"}` : "",
                }));
              }}
              options={assetTypeList}
              placeholder="Asset Type"
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
              <div className="text-start">
                <span className="text-muted fw-bold mx-6">
                  <b> {selectedValues.length}</b> assets selected
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

export { ChannelsListHeader };
