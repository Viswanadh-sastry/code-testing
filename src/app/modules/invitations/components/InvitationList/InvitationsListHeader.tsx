import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { KTIcon } from "../../../../../_metronic/helpers";

interface IInvitationsListHeaderProps {
  invitationListQuery: any;
}

const InvitationsListHeader = ({ invitationListQuery }: IInvitationsListHeaderProps) => {
  const invitationList = invitationListQuery?.data?.invitations || [];

  // Function to convert the data to CSV format
  const convertToCSV = (data: any[], headerOrder: string[]) => {
    // Create a header with the specified order
    // const header = headerOrder.map((header) => header.toUpperCase()).join(",") + "\n";

    const header =
      headerOrder
        .map(
          (key) =>
            ({
              user_id: "USER ID",
              name: "NAME",
            }[key])
        )
        .join(",") + "\n";

    // Map each row to a CSV string
    const rows = data
      .map((row: any) => {
        return headerOrder
          .map((key) => {
            let value = row[key];

            if (key === "name") {
              // Custom formatting for the 'name' field
              value = `You have invited ${row.toUserName} from the user ${row.fromUserName} to join the organization ${row.domainName} with the relation ${row.relation}`;
            }

            // Enclose each value in quotes if not undefined, otherwise use an empty string
            return value !== undefined ? `"${value}"` : '""';
          })
          .join(",");
      })
      .join("\n");

    return header + rows;
  };

  // Convert data to CSV and download
  const downloadCSV = () => {
    if (invitationList.length === 0) {
      toast.error("No data found to download!");
      return;
    }

    // Define the order of columns for the CSV
    const headerOrder = ["user_id", "name"];

    const csvString = convertToCSV(invitationList, headerOrder);
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Invitation-List.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadXlsx = () => {
    // Define the order of columns for the XLSX (limited to id and name)
    const headerOrder = ["user_id", "name"];

    const headerLabels = headerOrder.map(
      (key) =>
        ({
          user_id: "USER ID",
          name: "NAME",
        }[key])
    );

    // Prepare the data in the correct order with the custom name format
    const formattedData = invitationList.map((item: any) => {
      return {
        id: item.id,
        name: `You have invited ${item.toUserName} from the user ${item.fromUserName} to join the organization ${item.domainName} with the relation ${item.relation}`,
      };
    });

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert the formatted data to a worksheet with headers
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headerOrder });

    // Update the headers to uppercase
    worksheet["!cols"] = headerOrder.map(() => ({ width: 50 })); // Set column widths for better readability
    headerOrder.forEach((key, index) => {
      worksheet[XLSX.utils.encode_cell({ r: 0, c: index })].v = headerLabels[index];
    });

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate a binary string representation of the workbook
    const workbookBinary = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    // Create a Blob from the binary string
    const blob = new Blob([workbookBinary], { type: "application/octet-stream" });

    // Create a download link for the blob
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Invitation-List.xlsx";

    // Append the anchor to the body
    document.body.appendChild(a);

    // Programmatically click the anchor to trigger the download
    a.click();

    // Clean up by removing the anchor and revoking the object URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    if (invitationList.length === 0) {
      toast.error("No data found to download!");
      return;
    }

    const doc = new jsPDF();
    const headerOrder = ["user_id", "name"];
    const displayHeader = headerOrder.map(
      (key) =>
        ({
          user_id: "USER ID",
          name: "NAME",
        }[key])
    );

    const data = invitationList.map((item: any) =>
      headerOrder.map((key) => {
        if (key === "name") {
          return `You have invited ${item.toUserName} from the user ${item.fromUserName} to join the organization ${item.domainName} with the relation ${item.relation}`;
        }
        return item[key] || "";
      })
    );

    // Set the title and calculate its width
    const title = "Invitation List";
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2; // Calculate the x-coordinate for center alignment

    // Add centered text to the document
    doc.text(title, textX, 10);

    // Define column widths
    const columnWidths = {
      0: { cellWidth: 30 }, // ID
      1: { cellWidth: 150 }, // Name
    };

    (doc as any).autoTable({
      head: [displayHeader],
      body: data,
      startY: 20,
      columnStyles: columnWidths,
      styles: { overflow: "linebreak" }, // Ensure long text breaks into a new line
    });

    doc.save("Invitation-List.pdf");
  };

  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          {/* begin::Search */}
          <div className="d-flex align-items-center position-relative my-1"></div>
          {/* end::Search */}
        </div>

        <div className="card-toolbar">
          <div className="d-flex justify-content-end" data-kt-invitation-table-toolbar="base">
            {/* <button type="button" className="btn btn-primary">
              <KTIcon iconName="plus" className="fs-2" />
              Invite User
            </button> */}
            <button type="button" className="btn btn-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
              <KTIcon iconName="exit-down" className="fs-2" />
              Export
            </button>
            <div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4" data-kt-menu="true">
              <div className="menu-item px-3" onClick={downloadXlsx}>
                <a className="menu-link px-3">XLSX File</a>
              </div>
              <div className="menu-item px-3" onClick={downloadCSV}>
                <a className="menu-link px-3">CSV File</a>
              </div>
              <div className="menu-item px-3" onClick={downloadPDF}>
                <a className="menu-link px-3">PDF File</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { InvitationsListHeader };
