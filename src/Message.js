import React from "react";
import "./Message.scss";

export default ({ body, snippet, subject, from, date }) => (
    <div className="message">
        <h1>{subject}</h1>
        <p>{from}</p>
        <p>{date.toLocaleString()}</p>
        {/* todo use dompurify */}
        <p dangerouslySetInnerHTML={{__html: snippet}} /> 
    </div>);