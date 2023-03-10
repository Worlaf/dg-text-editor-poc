import * as React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import "./ToolbarButton.css";

type Props = {
  icon: IconDefinition;
  onClick: () => void;
};

export const ToolbarButton: React.FC<Props> = ({ icon, onClick }) => {
  return (
    <button
      className="toolbarButton"
      onMouseDown={(e) => {
        // prevent switching focus to button
        e.preventDefault();
        onClick();
      }}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};
