import React, { Component } from "react";
import axios from "axios";
import { Message, Button, Table, Card } from "semantic-ui-react";
import ElectionHeader from "../layout/Election-Header";
import withRouter from "./withRouter";

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
      winnerList: [],
      partyConsituencyCount: [],
      winningParty: "",
      maxConsituencyWin: 0,
      partyCountCard: false,
    };

    this.closeElection = this.closeElection.bind(this);
    this.electionResult = this.electionResult.bind(this);
  }

  async componentDidMount() {
    // get the contract address from the url
    await this.setState({
      contractAddress: this.props.params.address,
    });

    axios
      .get(endpoint + "/api/v1/getElectionAdmin/" + this.state.contractAddress)
      .then((res) => {
        this.setState({
          admin: res.data,
        });
        // console.log("admin", res.data);
      });
  }

  // close the active election
  closeElection() {
    axios
      .post(endpoint + "/api/v1/closeElection/" + this.state.contractAddress, {
        account: this.state.admin,
      })
      .then((res) => {
        if (res.data.status)
          this.setState({
            message: `${res.data.message}! TxHash: ${res.data.transactionHash}`,
          });
        else {
          this.setState({
            message: `${res.data.message}! `,
          });
        }
      });
  }

  // get the result of the elction
  electionResult() {
    axios
      .get(endpoint + "/api/v1/electionData/" + this.state.contractAddress)
      .then((res) => {
        console.log(res);
        // let partyData = res.data[1];
        this.setState({
          winnerList: res.data.map((winner) => ({
            consituencyId: winner.consituencyId,
            consituencyName: winner.consituencyName,
            candidateId: winner.candidateId,
            candidateName: winner.candidateName,
            votes: winner.votes,
            candidateParty: winner.candidateParty,
          })),
          winnerTable: true,
        });
      });

    axios
      .get(endpoint + "/api/v1/electionResult/" + this.state.contractAddress)
      .then((res) => {
        console.log("-->", res);

        this.setState({
          partyConsituencyCount: res.data[0].map((obj) => ({
            party: obj.party,
            seats: obj.count,
            index: obj.index,
          })),
          partyCountCard: true,
          message: `Result of the election is ${res.data[1]} won maximum consituencies with count ${res.data[2]}`,
        });
      });
  }

  partyConsituencyCount() {
    if (this.state.partyCountCard) {
      let items = this.state.partyConsituencyCount.map((partyObj) => ({
        header: partyObj.party,
        description: `Consituency Win Count: ${partyObj.seats}`,
      }));
      return <Card.Group items={items} />;
    }
  }

  winnerTable() {
    if (this.state.winnerTable) {
      const { Header, HeaderCell, Row } = Table;
      return (
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
          <Table.Body>{this.winnerTableBody()}</Table.Body>
        </Table>
      );
    }
  }
  winnerTableBody() {
    if (this.state.winnerTable) {
      const { Row, Cell } = Table;
      return this.state.winnerList.map((winner, index) => {
        return (
          <Row key={index}>
            <Cell>{winner.candidateId}</Cell>
            <Cell>{winner.candidateName}</Cell>
            <Cell>{winner.votes}</Cell>
            <Cell>{winner.consituencyName}</Cell>
            <Cell>{winner.candidateParty}</Cell>
          </Row>
        );
      });
    }
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
          <Message.Header>Result</Message.Header>
          <p>{this.state.message}</p>
        </Message>
        {this.partyConsituencyCount()}
        {this.winnerTable()}
      </div>
    );
  }
}

export default withRouter(Result);
