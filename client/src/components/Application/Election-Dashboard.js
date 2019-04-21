import React, { Component } from "react";

import ListOfAccounts from "./List-Of-Accounts";
import Header from "../Layout/Header";

class Election extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consistuency: "",
      candidate: "",
      voter: "",
      listOfAccounts: []
    };
  }

  componentDidMount = async () => {
    this.setState({
      listOfAccounts: [1, 2, 3, 4, 4, 5, 5, 77878]
    });
    console.log(this.state.listOfAccounts);
  };

  render() {
    return (
      <div>
        <Header />
        <div className="row">
          <div
            className="col-sm-4"
            style={{ paddingTop: "40px", paddingLeft: "70px" }}
          >
            <ListOfAccounts />
          </div>
          <div className="col-sm-8">
            <form className="election-form">
              <div className="row">
                <div className="col-sm-8 form-group">
                  <input
                    name="consistuency"
                    type="text"
                    className="form-control"
                    placeholder="Enroll the Consistuency"
                    required
                  />
                </div>
                <div className="col-sm-4 form-group">
                  <button type="submit" className="btn btn-primary form-button">
                    New Consistuency
                  </button>
                </div>
              </div>
            </form>

            <form className="election-form">
              <div className="row">
                <div className="col-sm-8 form-group">
                  <input
                    name="candidate"
                    type="text"
                    className="form-control"
                    placeholder="Enroll the Candidate"
                    required
                  />
                </div>
                <div className="col-sm-4 form-group">
                  <button type="submit" className="btn btn-primary form-button">
                    New Candidate
                  </button>
                </div>
              </div>
            </form>

            <form className="election-form">
              <div className="row">
                <div className="col-sm-8 form-group">
                  <input
                    name="voter"
                    type="text"
                    className="form-control"
                    placeholder="Enroll the Voter"
                    required
                  />
                </div>
                <div className="col-sm-4 form-group">
                  <button type="submit" className="btn btn-primary form-button">
                    New Voter
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div />
      </div>
    );
  }
}

export default Election;
