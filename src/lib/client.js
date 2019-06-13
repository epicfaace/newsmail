import { find } from "lodash";
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
        var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

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

    async getEmails() {
        // https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest

        console.log(gapi.client);
        const userId = "me";
        const { gmail } = gapi.client;
        const response = await gmail.users.messages.list({ userId });
        const messages = response.result.messages; //nextPageToken, resultSizeEstimate
        // console.log(results);
        return async function* () {
            for (const { id, threadId } of messages) {
                const { result } = await gmail.users.messages.get({ id, userId });
                const { snippet, payload } = result;
                // console.log(payload, result);
                // console.log(snippet, payload.body.data, payload.headers);
                const { headers } = payload;
                console.log(result);
                let body = null;
                if (payload.mimeType === "multipart/alternative") {
                    body = null;
                    for (let part of payload.parts) {
                        // Prefer html, default to anything.
                        if (!body) {
                            body = part.body;
                        }
                        else if (part.mimeType === "text/html") {
                            body = part.body;
                        }
                    }
                }
                else {
                    body = payload.body;
                }
                if (body.size > 0) {
                    body = atob(body.data.replace(/-/g, '+').replace(/_/g, '/'));
                }
                else {
                    body = "";
                }
                console.log(headers);
                const subject = find(headers, {name: "Subject"}).value;
                const from = find(headers, {name: "From"}).value;
                const date = new Date(find(headers, {name: "Date"}).value);
                yield { body, snippet, subject, from, date };
            }
        };
        // console.log(response);
    }
}