import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deleteDashboard, getDashboardList } from "../../../api/DashboardAPI";
import { EditDashboard } from "../../AddEditDashboard/EditDashboard";

type Props = {
  id: string;
};

const DashboardActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const [showEditDashboard, setShowEditDashboard] = useState({
    id: "",
    edit: false,
  });
  const filterDashboard = {
    limit: 10,
    page: 0,
    name: "",
  };
  const dashboardListQuery = useQuery({
    queryKey: [`dashboardList`, filterDashboard],
    queryFn: async () => getDashboardList(filterDashboard),
    enabled: false,
  });

  const onDeleteDashboard = () => {
    Swal.fire({
      heightAuto: false,
      icon: "warning",
      title: "Delete Dashboard",
      text: "Are you sure you want to delete this dashboard?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDashboard(id)
          .then(() => {
            toast.success("Dashboard deleted successfully");
            navigate("/dashboard");
          })
          .catch((error) => toast.error(error.message));
      }
    });
  };

  const onEditDashboard = () => {
    setShowEditDashboard({
      id: id,
      edit: true,
    });
  };

  const onCloseEditDashboard = () => {
    setShowEditDashboard({
      id: "",
      edit: false,
    });
  };

  const onGetDashboardList = () => {
    dashboardListQuery.refetch();
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm me-2" onClick={onEditDashboard}>
        Edit
      </button>
      <button type="button" className="btn btn-light btn-light-danger btn-sm" onClick={onDeleteDashboard}>
        Delete
      </button>
      {showEditDashboard.edit && <EditDashboard id={showEditDashboard.id} onCloseEditDashboard={onCloseEditDashboard} onGetDashboardList={onGetDashboardList} />}
    </>
  );
};

export { DashboardActionsCell };
