import React, { Component } from "react";
import axios from "axios";
import { Message, Button, Table } from "semantic-ui-react";
import ElectionHeader from "../layout/Election-Header";

const endpoint = "http://localhost:4000";

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractAddress: "",
      admin: "",
      message: "",
      candidateId: "",
      votes: 0,
      winnerTable: false,
      winnerList: []
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
        // console.log("admin", res.data);
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
    // console.log(
    //   endpoint + "/api/v1/electionWinner/" + this.state.contractAddress
    // );
    axios
      .post(endpoint + "/api/v1/electionWinner/" + this.state.contractAddress)
      .then(res => {
        console.log(res.data);
        this.setState({
          winnerList: res.data.map(winner => ({
            consituencyId: winner.consituencyId,
            consituencyName: winner.consituencyName,
            candidateId: winner.candidateId,
            candidateName: winner.candidateName,
            votes: winner.votes
          })),
          winnerTable: true
        });
        this.setState({
          message: `Winner of the election is ${
            Object.values(res.data)[0].candidateId
          } total votes: ${Object.values(res.data)[0].votes}`,
          candidateId: res.data.candidateId,
          votes: res.data.votes
        });
      });
  }

  winnerTable() {
    if (this.state.winnerTable) {
      const { Row, Cell } = Table;
      return this.state.winnerList.map((winner, index) => {
        return (
          <Row key={index}>
            <Cell>{winner.candidateId}</Cell>
            <Cell>{winner.candidateName}</Cell>
            <Cell>{winner.votes}</Cell>
            <Cell>{winner.consituencyName}</Cell>
            <Cell>Democratic</Cell>
          </Row>
        );
      });
    }
  }
  render() {
    const { Header, HeaderCell, Row } = Table;
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
          <Message.Header>Result</Message.Header>
          <p>{this.state.message}</p>
        </Message>
        <Table>
          <Header>
            <Row>
              <HeaderCell>Candidate Id</HeaderCell>
              <HeaderCell>Candidate Name</HeaderCell>
              <HeaderCell>Votes</HeaderCell>
              <HeaderCell>Consituency</HeaderCell>
              <HeaderCell>Party</HeaderCell>
            </Row>
          </Header>
          <Table.Body>{this.winnerTable()}</Table.Body>
        </Table>
      </div>
    );
  }
}

export default Result;
