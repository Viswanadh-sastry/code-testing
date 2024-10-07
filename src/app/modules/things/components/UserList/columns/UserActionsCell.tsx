import { FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string | undefined;
};

const UserActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();

  const displayUserData = () => {
    navigate(`/things/${id}/view`);
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-active-light-primary btn-sm mx-2" onClick={displayUserData}>
        View
      </button>
      <button type="button" className="btn btn-light btn-danger btn-sm">
        Delete
      </button>
    </>
  );
};

export { UserActionsCell };
