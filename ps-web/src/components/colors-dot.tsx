import React from "react";

export interface ColorDotProps {
  color: string;
}

const ColorDot: React.FC<ColorDotProps> = ({ color }) => {
  return <div className={`w-2 h-2 rounded-full bg-${color}-500 mr-2`} />;
};

export default ColorDot;
