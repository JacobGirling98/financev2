import React from "react";

interface SummaryTileInterface {
  title: string;
  body: number;
}

const SummaryTile: React.FC<SummaryTileInterface> = ({
  title,
  body
}) => {
  return (
    <div className="card p-3">
      <div className="card-body">
        <h4 className="card-text d-flex justify-content-center fst-italic fw-light">
          {title}
        </h4>
        <h2 className="card-text d-flex justify-content-center fw-light">
          {body}
        </h2>
      </div>
    </div>
  );
};

export default SummaryTile;
