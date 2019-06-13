import React from 'react';
import logo from './logo.svg';
// import Login from "./Login";
import './App.css';
import Main from './Main';
import Client from "./lib/client";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.client = new Client();
    this.state = {
      loggedIn: false,
      loading: true
    }
  }
  async componentDidMount() {
    await this.client.load();
    const status = await this.client.getSigninStatus();
    this.setState({ loggedIn: status, loading: false });
  }
  async onLogin(response) {
    console.log(response);
    const jwt = response.Zi.id_token;
    localStorage.setItem("jwt", jwt);
    this.setState({ loggedIn: true });
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
      </div>
    );
  }
}

export default App;
