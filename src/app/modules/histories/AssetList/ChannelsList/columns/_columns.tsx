import { Column } from "react-table";
import { convertGMTToLocalDateTime } from "../../../../../constants/Common";
import { Channels } from "../../../api/_models";
import { ChannelsCustomHeader } from "./ChannelsCustomHeader";

const channelsColumns: ReadonlyArray<Column<Channels>> = [
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="" className="min-w-20px" />,
    accessor: "checkbox",
  },
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="Description" className="min-w-125px" />,
    accessor: "description",
  },
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="Metadata" className="min-w-125px" />,
    accessor: "metadata",
    Cell: ({ value }) => {
      if (!value || typeof value !== "object") {
        return <span className="text-muted"></span>;
      }
      return (
        <div>
          {Object.entries(value).map(([key, val], index) => (
            <span key={index} className="badge badge-light-primary mr-2" style={{ display: "inline-block", marginBottom: "4px", marginRight: "4px" }}>
              {`${key}: ${val}`}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="Created At" className="min-w-125px" />,
    accessor: "created_at",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="Status" className="min-w-50px" />,
    accessor: "status",
    Cell: ({ ...props }) => (
      <>
        {props.data[props.row.index].status === "enabled" ? (
          <div className="badge badge-light-success fw-bolder">enabled</div>
        ) : (
          <div className="badge badge-light-danger fw-bolder">disabled</div>
        )}
      </>
    ),
  },
];

export { channelsColumns };
