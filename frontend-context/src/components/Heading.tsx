import React from "react";
import "../assets/styles/styles.css";
import type { JSX } from "react";
function Heading({ id }: { id?: string | undefined }): JSX.Element {
  return (
    <>
      <div className="newNoteHeading">
        <h1>{id ? id.toUpperCase() : null}</h1>
      </div>
    </>
  );
}
export default Heading;
