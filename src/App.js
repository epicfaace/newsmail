import React from 'react';
import logo from './logo.svg';
// import Login from "./Login";
import './App.css';
import Main from './Main';
import Client from "./lib/client";
import Message from './Message';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.client = new Client();
    this.state = {
      loggedIn: false,
      loading: true,
      messages: []
    }
  }
  async componentDidMount() {
    await this.client.load();
    const status = await this.client.getSigninStatus(); // TODO fix -- when user logs in for the first time, status is still false, until they refresh the page.
    const messages = status ? await this.client.getEmails(): []; 
    // const getEmailGenerator = getEmail();
    // for (let i = 0; i <= 10; i++) {
    //   messages.push(await );
    // }
    // console.log(Array(10).map(e => getEmailGenerator.next()));
    // const messages = await Promise.all(Array.from(Array(10)).map(e => getEmailGenerator.next()));
    this.setState({ loggedIn: status, loading: false, messages });
  }
  render() {
    if (this.state.loading) {
      return <div>Loading</div>;
    }
    // const loggedIn = localStorage.getItem("jwt");
    return (
      <div>
        {!this.state.loggedIn && <button onClick={e => this.client.handleAuthClick()}>Sign in</button>}
        {this.state.loggedIn && <Main />}
        {this.state.loggedIn && <button onClick={async e => { await this.client.revokeAccess(); this.setState({ loggedIn: false }) }}>Logout</button>}
        <div className="message-grid">
          {this.state.messages && this.state.messages.map((e, i) => <Message key={e.id} {...e} i={i} />)}
        </div>
      </div>
    );
  }
}

export default App;
