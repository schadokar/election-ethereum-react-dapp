import React, { Component } from "react";
import Header from "../Layout/Header";

class CreateElection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: 0,
      listOfContracts: []
    };
  }

  componentDidMount = async () => {
    this.setState({
      listOfContracts: [1, 2, 4, 5]
    });

    console.log(this.state.listOfContracts);
  };

  render() {
    return (
      <div>
        <Header />
        <div className="container-fluid">
          <div className="row">
            <fieldset>
              <form>
                <div className="form-group">
                  <input
                    name="duration"
                    type="text"
                    className="form-control"
                    placeholder="Enter the duration of Election in minutes"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Create Election
                </button>
              </form>
            </fieldset>
          </div>
          <div className="row">
            <div className="contract-details">
              <div className="election-card">
                Election Created
                {this.state.listOfContracts.map(contract => (
                  <div>{contract}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateElection;
