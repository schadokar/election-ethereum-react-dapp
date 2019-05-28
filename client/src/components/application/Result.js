import React, { Component } from "react";
import axios from "axios";
import { Form, Message, Button } from "semantic-ui-react";
import ElectionHeader from "../layout/Election-Header";

const endpoint = "http://localhost:4000";

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractAddress: "",
      admin: "",
      message: ""
    };

    this.closeElection = this.closeElection.bind(this);
    this.electionResult = this.electionResult.bind(this);
  }

  async componentDidMount() {
    // get the contract address from the url
    const url = window.location.href;
    await this.setState({
      contractAddress: url.split("/")[url.split("/").length - 1]
    });

    await axios
      .get(endpoint + "/api/v1/getElectionAdmin/" + this.state.contractAddress)
      .then(res => {
        this.setState({
          admin: res.data
        });
        console.log("admin", res.data);
      });
  }

  // close the active election
  closeElection() {
    axios
      .post(endpoint + "/api/v1/closeElection/" + this.state.contractAddress, {
        account: this.state.admin
      })
      .then(res => {
        this.setState({
          message: res.data.transactionHash
        });
      });
  }

  // get the result of the elction
  electionResult() {
    console.log(
      endpoint + "/api/v1/electionWinner/" + this.state.contractAddress
    );
    axios
      .post(endpoint + "/api/v1/electionWinner/" + this.state.contractAddress, {
        account: this.state.admin
      })
      .then(res => {
        console.log(res);
        this.setState({
          message: res.data.transactionHash
        });
      });
  }

  render() {
    return (
      <div>
        <ElectionHeader />
        <Button primary type="submit" onClick={this.closeElection}>
          Close Election
        </Button>
        <Button primary type="submit" onClick={this.electionResult}>
          Election Result
        </Button>
        <Message info>
          <Message.Header>Winner of the Election</Message.Header>
          <p>{this.state.message}</p>
        </Message>
      </div>
    );
  }
}

export default Result;
