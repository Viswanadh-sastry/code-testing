import { Column } from "react-table";
// import { GroupChannelActionsCell } from "./GroupChannelActionsCell";
import { convertGMTToLocalDateTime } from "../../../../../../constants/Common";
import { GroupChannel } from "../../../../api/_models";
import { GroupChannelCustomHeader } from "./GroupChannelCustomHeader";

const groupChannelColumns: ReadonlyArray<Column<GroupChannel>> = [
  {
    Header: (props) => <GroupChannelCustomHeader tableProps={props} title="Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <GroupChannelCustomHeader tableProps={props} title="Description" className="min-w-125px" />,
    accessor: "description",
  },
  {
    Header: (props) => <GroupChannelCustomHeader tableProps={props} title="Metadata" className="min-w-125px" />,
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
    Header: (props) => <GroupChannelCustomHeader tableProps={props} title="Created At" className="min-w-125px" />,
    accessor: "created_at",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
  // {
  //   Header: (props) => <GroupChannelCustomHeader tableProps={props} title="Actions" className="text-end min-w-100px" />,
  //   id: "actions",
  //   Cell: ({ ...props }) => <GroupChannelActionsCell id={props.data[props.row.index].id} />,
  // },
];

export { groupChannelColumns };
