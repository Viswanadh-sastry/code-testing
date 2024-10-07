import { FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string | undefined;
};

const DashboardActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();

  const openEditChannelPage = () => {
    navigate(`/channels/edit/${id}`);
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm" onClick={openEditChannelPage}>
        View
      </button>
    </>
  );
};

export { DashboardActionsCell };
