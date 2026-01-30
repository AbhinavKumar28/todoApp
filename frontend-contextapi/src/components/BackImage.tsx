import type { JSX } from "react";
import "../assets/styles/styles.css";
import "../assets/images/back-arrow-svgrepo-com.svg";
import images from "../constants/imagesImports.ts";
import { useNavigate } from "react-router-dom";
function BackImage(): JSX.Element {
  const navigate = useNavigate();
  return (
    <>
      <img
        src={images.backArrow}
        onClick={() => navigate("/main")}
        aria-hidden
        className="backImage"
        alt=""
      />
    </>
  );
}
export default BackImage;
