import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { KTCard, KTCardBody, KTIcon } from "../../../../../_metronic/helpers";
import { getDashboard } from "../../api/DashboardAPI";

const ViewDashboard = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id as string;
  const dashboardQuery = useQuery({
    queryKey: [`dashboard`, id],
    queryFn: async () => getDashboard(id).catch((error) => toast.error(error.message)),
    enabled: true,
  });
  const dashboard = dashboardQuery.data;
  console.log("dashboard", dashboard);

  const redirectToLayout = () => {
    navigate(`/dashboard/${id}/layout`);
  };

  return (
    <>
      <div className="card-header d-flex justify-content-between py-6 px-9">
        <div className="card-title"></div>
        <div className="card-toolbar">
          <button type="button" className="btn btn-light mx-2" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
          <button type="button" className="btn btn-primary" onClick={redirectToLayout}>
            <KTIcon iconName="plus" className="fs-2" />
            Modify Layout
          </button>
        </div>
      </div>
      <KTCard>
        <KTCardBody className="py-4">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </KTCardBody>
      </KTCard>
    </>
  );
};

export { ViewDashboard };
