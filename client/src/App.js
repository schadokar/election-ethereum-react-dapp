import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

import CreateElection from "./components/Application/Create-Election";
import Election from "./components/Application/Election-Dashboard";
import ListOfAccounts from "./components/Application/List-Of-Accounts";
import Voter from "./components/Application/Voter-Dashboard";
class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={CreateElection} />
        <Route exact path="/election" component={Election} />
        <Route exact path="/voter" component={Voter} />
      </Router>
    );
  }
}

export default App;
