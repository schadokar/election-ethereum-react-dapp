import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import Header from "../src/components/layout/Header";
import CreateElection from "../src/components/application/CreateElection";
import Election from "../src/components/application/Election";
import RegisterVoter from "../src/components/application/Register-Voter";
import RegisterCandidate from "../src/components/application/Register-Candidate";

class App extends Component {
  render() {
    return (
      <div>
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
          </Router>
        </Container>
      </div>
    );
  }
}

export default App;
