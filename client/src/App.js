import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return(
      <Router>
        <div className="App">
          <Route exact path="/" Component={Landing}></Route>
        </div>
      </Router>
    );
  }
}

export default App;
