import React from "react";
import "./Loading.css";

// this will display the loading screen
export default function Loading({ message }) {
  return (
    <div className="loading">
      <div className="loading-spinner" />
      <p className="loading-message">{message}</p>
    </div>
  );
}
