import { Column } from "react-table";
import { convertGMTToLocalDateTime } from "../../../../../../constants/Common";
import { ChannelThing } from "../../../../api/_models";
import { ThingActionsCell } from "./ThingActionsCell";
import { ThingCustomHeader } from "./ThingCustomHeader";

const thingsColumns: ReadonlyArray<Column<ChannelThing>> = [
  {
    Header: (props) => <ThingCustomHeader tableProps={props} title="Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <ThingCustomHeader tableProps={props} title="Tags" className="min-w-125px" />,
    accessor: "tags",
    Cell: ({ value }) => (
      <>
        {value?.map((tag: string, index: number) => (
          <div key={index} className="badge badge-light-primary fw-bolder me-2">
            {tag}
          </div>
        ))}
      </>
    ),
  },
  {
    Header: (props) => <ThingCustomHeader tableProps={props} title="Metadata" className="min-w-125px" />,
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
    Header: (props) => <ThingCustomHeader tableProps={props} title="Created At" className="min-w-125px" />,
    accessor: "created_at",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
  {
    Header: (props) => <ThingCustomHeader tableProps={props} title="Actions" className="text-end min-w-100px" />,
    id: "actions",
    Cell: ({ ...props }) => <ThingActionsCell id={props.data[props.row.index].id} />,
  },
];

export { thingsColumns };
