import React from "react";
import { Contact } from "../../types";
import { getInitials } from "../../utils/formatters";
import "./PersonInfo.css";

interface PersonInfoProps {
  data: Contact;
}

export const PersonInfo = ({ data }: PersonInfoProps) => {

  return (
    <div className="person-info">
      <div className="person-info-header">
        <div className="person-initials-circle">
          {getInitials(data.firstNameLastName)}
        </div>
        <div className="person-details">
          <div className="person-name">{data.firstNameLastName}</div>
          <div className="person-job-title">{data.jobTitle}</div>
        </div>
      </div>
      <div className="person-email">{data.emailAddress}</div>
    </div>
  );
};
