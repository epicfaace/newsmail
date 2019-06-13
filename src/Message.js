import React from "react";
import "./Message.scss";

export default ({ body, snippet, subject, from, date, i }) => (
    <div className="message" style={{width: "100%"}}>
        {subject} - {from.replace(/\<.*?\>/g, "").replace(/\"(.*?)\"/g, "$1") }
        {/* <h1>{subject}</h1> */}
        {/* <p>{from}</p> */}
        {/* <p>{date.toLocaleString()}</p> */}
        {/* todo use dompurify */}
        {/* <p dangerouslySetInnerHTML={{__html: snippet}} />  */}
    </div>);
// heads of people to sort from emails?