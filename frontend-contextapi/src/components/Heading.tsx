import React from "react";
import "../assets/styles/styles.css";
import type { JSX } from "react";
import { useIdContext } from "../pages/Id";
function Heading(): JSX.Element {
  const id = useIdContext();
  return (
    <>
      <div className="newNoteHeading">
        <h1>{id ? id.toUpperCase() : null}</h1>
      </div>
    </>
  );
}
export default Heading;
