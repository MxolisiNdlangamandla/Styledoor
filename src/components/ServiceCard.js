import React from "react";

function ServiceCard({ title = "Service" }) {
  return (
    <div className="service-card">
      <div className="service-image" />
      <div className="service-title">{title}</div>
    </div>
  );
}

export default ServiceCard;
