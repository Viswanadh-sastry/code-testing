import { FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string | undefined;
};

const ChannelMessagingCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const openMessagingPage = () => {
    navigate(`/history/asset/${id}`);
  };

  return (
    <button className="btn btn-icon btn-sm" onClick={openMessagingPage}>
      <i className="ki-duotone ki-sms fs-2x">
        <span className="path1"></span>
        <span className="path2"></span>
      </i>
    </button>
  );
};

export { ChannelMessagingCell };
