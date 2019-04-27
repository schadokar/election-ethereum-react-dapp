import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import Header from "../src/components/layout/Header";
import CreateElection from "../src/components/application/CreateElection";

class App extends Component {
  render() {
    return (
      <div>
        <Container fluid>
          <Header />
          <CreateElection />
        </Container>
      </div>
    );
  }
}

export default App;
