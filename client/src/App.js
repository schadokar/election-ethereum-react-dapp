import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Segment } from "semantic-ui-react";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import {
  Candidates,
  CreateElection,
  Election,
  RegisterCandidate,
  RegisterVoter,
  Result,
  Vote,
  Voters,
} from "./components/application/index";

function App() {
  return (
    <div className="container">
      <Container>
        <Header />
        <Segment>
          <Router>
            <Routes>
              <Route exact path="/" element={<CreateElection />} />
              <Route path="/election/:address" element={<Election />} />
              <Route
                path="/voterRegistration/:address"
                element={<RegisterVoter />}
              />
              <Route
                path="/candidateRegistration/:address"
                element={<RegisterCandidate />}
              />
              <Route path="/vote/:address" element={<Vote />} />
              <Route path="/result/:address" element={<Result />} />
              <Route path="/voters/:address" element={<Voters />} />
              <Route path="/candidates/:address" element={<Candidates />} />
            </Routes>
          </Router>
        </Segment>
        <Footer />
      </Container>
    </div>
  );
}

export default App;
