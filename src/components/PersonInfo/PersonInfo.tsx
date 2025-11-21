import React from "react";
import { Contact } from "../../types";
import "./PersonInfo.css";

interface PersonInfoProps {
  data: Contact;
}

export const PersonInfo = ({ data }: PersonInfoProps) => {
  // Extract initials from first and last name
  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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

