import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import Header from "../src/components/layout/Header";
import CreateElection from "./components/application/Create-Election";
import Election from "../src/components/application/Election";
import Voters from "../src/components/application/Voters";
import Candidates from "../src/components/application/Candidates";
import RegisterVoter from "../src/components/application/Register-Voter";
import RegisterCandidate from "../src/components/application/Register-Candidate";
import Vote from "../src/components/application/Vote";
import Result from "../src/components/application/Result";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="container">
        <Container>
          <Header />
          <Router>
            <Route exact path="/" component={CreateElection} />
            <Route path="/election" component={Election} />
            <Route path="/voterRegistration" component={RegisterVoter} />
            <Route
              path="/candidateRegistration"
              component={RegisterCandidate}
            />
            <Route path="/vote" component={Vote} />
            <Route path="/result" component={Result} />
            <Route path="/voters" component={Voters} />
            <Route path="/candidates" component={Candidates} />
          </Router>
        </Container>
      </div>
    );
  }
}

export default App;
