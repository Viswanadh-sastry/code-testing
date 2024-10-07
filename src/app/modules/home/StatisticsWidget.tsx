import React from "react";
import { KTIcon } from "../../../_metronic/helpers";

type Props = {
  color: string;
  svgIcon: string;
  iconColor: string;
  title: string;
  titleColor?: string;
  description: string;
  descriptionColor?: string;
};

const StatisticsWidget: React.FC<Props> = ({ color, svgIcon, iconColor, title, titleColor, description, descriptionColor }) => {
  return (
    <a href="#" className={`card bg-${color} hoverable mb-xl-8`}>
      <div className="card-body d-flex align-items-center pt-3 pb-5">
        <div className="d-flex flex-column flex-grow-1 py-2 me-2">
          <div className={`text-${titleColor} fw-bold fs-2 mb-2 mt-5`}>{title}</div>

          <div className={`fw-semibold text-${descriptionColor}`}>{description}</div>
        </div>
        <KTIcon iconName={svgIcon} className={`text-${iconColor} fs-5x ms-n1`} />
      </div>
    </a>
  );
};

export { StatisticsWidget };
