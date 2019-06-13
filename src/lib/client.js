// import google from "googleapis";
// import GoogleAuth from "google-auth-library";
const gapi = window.gapi;
let GoogleAuth;
var SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

export default class Client {

    constructor(props) {
        // super(props);
    }

    async load() {
        // Load the API's client and auth2 modules.
        // Call the initClient after the modules load.
        return new Promise((resolve, reject) => {
            gapi.load('client:auth2', async () => {
                await this.initClient();
                resolve();
            });
        });
    }

    async initClient() {
        // Retrieve the discovery document for version 3 of Google Drive API.
        // In practice, your app can retrieve one or more discovery documents.
        var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

        // Initialize the gapi.client object, which app uses to make API requests.
        // Get API key and client ID from API Console.
        // 'scope' field specifies space-delimited list of access scopes.
        await gapi.client.init({
            // 'apiKey': 'YOUR_API_KEY',
            'discoveryDocs': [discoveryUrl],
            'clientId': '847991036793-78cgvjl6pigk1b851aakobaiq861us50.apps.googleusercontent.com',
            'scope': SCOPE
        });
        GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(() => this.updateSigninStatus());

        // Handle initial sign-in state. (Determine if user is already signed in.)
        var user = GoogleAuth.currentUser.get();
        this.setSigninStatus();

        // Call handleAuthClick when user clicks on
        //      "Sign In/Authorize" button.
        // $('#sign-in-or-out-button').click(() {
        //     handleAuthClick();
        // });
        // $('#revoke-access-button').click(() {
        //     revokeAccess();
        // });
    }

    getSigninStatus() {
        return GoogleAuth.isSignedIn.get();
    }

    handleAuthClick() {
        if (GoogleAuth.isSignedIn.get()) {
            // User is authorized and has clicked 'Sign out' button.
            GoogleAuth.signOut();
        } else {
            // User is not signed in. Start Google auth flow.
            GoogleAuth.signIn();
        }
    }

    revokeAccess() {
        GoogleAuth.disconnect();
    }

    setSigninStatus(isSignedIn) {
        var user = GoogleAuth.currentUser.get();
        var isAuthorized = user.hasGrantedScopes(SCOPE);
        if (isAuthorized) {
            // $('#sign-in-or-out-button').html('Sign out');
            // $('#revoke-access-button').css('display', 'inline-block');
            // $('#auth-status').html('You are currently signed in and have granted ' +
            //     'access to this app.');
        } else {
            // $('#sign-in-or-out-button').html('Sign In/Authorize');
            // $('#revoke-access-button').css('display', 'none');
            // $('#auth-status').html('You have not authorized this app or you are ' +
            //     'signed out.');
        }
    }

    updateSigninStatus(isSignedIn) {
        this.setSigninStatus();
    }

    // export class Client {
    //     constructor(props) {
    //         this.gmail = gapi.gmail({ version: 'v1', auth })
    //     }
    //     getEmails() {
    //         return gapi.
    //     }
    // }
}