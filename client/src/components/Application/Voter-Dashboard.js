import React, { Component } from "react";
import Header from "../Layout/Header";

class Voter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfVoters: [],
      listOfCandidates: [],
      consituency: ""
    };
  }

  componentDidMount = async () => {
    this.setState({
      listOfVoters: ["v1", "v2", "v3"],
      listOfCandidates: ["c1", "c2", "c3"],
      consituency: "winterfell"
    });
  };

  render() {
    return (
      <div>
        <Header />
        <div className="voter-dashboard">
          <div className="row">
            <div className="col-sm-4">
              <div className="voter-card">
                Select Voter
                <form>
                  {this.state.listOfVoters.map(voter => (
                    <div class="form-check">
                      <label class="form-check-label">
                        <input
                          type="radio"
                          class="form-check-input"
                          name="optVoter"
                          value={voter}
                        />
                        {voter}
                      </label>
                    </div>
                  ))}
                </form>
              </div>
            </div>

            <div className="col-sm-8">
              <div className="voter-card">
                Select Your Candidate
                {this.state.listOfCandidates.map(candidate => (
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <input
                          type="text"
                          name="candidate"
                          className="form-control"
                          placeholder={candidate}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <button
                          type="submit"
                          className="btn btn-primary form-button"
                        >
                          Vote
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Voter;
