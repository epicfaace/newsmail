import React from "react";
import GoogleLogin from 'react-google-login';
// import { handleAuthClick } from "./lib/client";


const errorGoogle = (error) => {
    console.error(error);
    alert("Error!");
}

// https://mail.google.com/

const scopes = ["https://www.googleapis.com/auth/gmail.readonly"];

export default (props) => <div>
    {/* <GoogleLogin
        clientId="847991036793-78cgvjl6pigk1b851aakobaiq861us50.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={response => props.onLogin(response)}
        onFailure={errorGoogle}
        cookiePolicy={'single_host_origin'}
        scopes={scopes}
    /> */}
    <button onClick={e => handleAuthClick()}>Sign in</button>
</div>;