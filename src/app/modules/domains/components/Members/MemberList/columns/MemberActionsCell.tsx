import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  userId: string | undefined;
};

const MemberActionsCell: FC<Props> = ({ userId }) => {
  const params = useParams();
  const domainId = params.id as string;
  const navigate = useNavigate();

  const openEditMemberPage = () => {
    navigate(`/domains/${domainId}/members/${userId}`);
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm" onClick={openEditMemberPage}>
        View
      </button>
    </>
  );
};

export { MemberActionsCell };
