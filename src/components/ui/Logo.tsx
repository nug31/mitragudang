import React from "react";
import logoImage from "../../img/logo.png";
import { APP_NAME } from "../../config";

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = "" }) => {
  return (
    <img
      src={logoImage}
      alt={`${APP_NAME} Logo`}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
};

export default Logo;
