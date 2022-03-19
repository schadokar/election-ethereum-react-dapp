import React, { Component } from "react";
import { Form, Dropdown, Button, Message } from "semantic-ui-react";
import axios from "axios";
import ElectionHeader from "../layout/Election-Header";
import withRouter from "./withRouter";

const endpoint = "http://localhost:4000";

class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractAddress: "",
      voterList: [],
      candidateList: [],
      voter: "",
      candidate: "",
      consituencyId: "",
      message: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    // get contract address from URL
    await this.setState({
      contractAddress: this.props.params.address,
    });

    // fetch all voters
    axios
      .get(endpoint + "/api/v1/getVoterList/" + this.state.contractAddress)
      .then((res) => {
        let arr = res.data;
        // console.log(res.data);
        this.setState({
          voterList: arr.map((arr) => ({
            key: arr.voterId,
            text: arr.name,
            value: arr.voterId,
          })),
        });
      });
  }

  async handleChange(e, result) {
    const { name, value } = result;
    this.setState({
      [name]: value,
    });
    // console.log(result.value, result.name);
    // get voters consituency

    if (result.name === "voter") {
      const voters = await axios.get(
        endpoint + "/api/v1/getVoter/" + this.state.contractAddress,
        {
          params: {
            voterId: result.value,
          },
        }
      );
      // console.log(voters, "cons id");
      this.setState({
        consituencyId: parseInt(voters.data.consituencyId),
      });

      const votersCandidates = await axios.get(
        endpoint +
          "/api/v1/getVoterConsituencyCandidates/" +
          this.state.contractAddress,
        {
          params: {
            voterId: result.value,
            consituencyId: this.state.consituencyId,
          },
        }
      );
      // console.log("res", this.state.consituencyId);
      let candidateList = votersCandidates.data.candidateList.map(
        (candidateId) =>
          axios
            .get(
              endpoint + "/api/v1/getCandidate/" + this.state.contractAddress,
              {
                params: { candidateId: candidateId },
              }
            )
            .then((res) => {
              return res.data;
            })
      );
      candidateList = await Promise.all(candidateList);
      // console.log("candidates", candidateList);
      this.setState({
        candidateList: candidateList.map((candidate) => ({
          key: candidate.candidateId,
          text: `${candidate.party} | ${candidate.name}`,
          value: candidate.candidateId,
        })),
      });
    }
  }

  onSubmit() {
    axios
      .post(endpoint + "/api/v1/castVote/" + this.state.contractAddress, {
        voterId: this.state.voter,
        consituencyId: this.state.consituencyId,
        candidateId: this.state.candidate,
      })
      .then((res) => {
        // console.log(res);
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

  message() {
    if (this.state.message.length) {
      return (
        <Message info>
          <Message.Header>
            <p>{this.state.message}</p>
          </Message.Header>
        </Message>
      );
    }
  }
  render() {
    return (
      <div>
        <ElectionHeader />
        <Form>
          <Form.Field
            label="Select Voter ID"
            placeholder="Select Voter ID"
            name="voter"
            fluid
            selection
            control={Dropdown}
            onChange={this.handleChange}
            options={this.state.voterList}
            value={this.state.voter}
          />
          <Form.Field
            label="Select Candidate ID"
            placeholder="Select Candidate ID"
            name="candidate"
            fluid
            selection
            control={Dropdown}
            onChange={this.handleChange}
            options={this.state.candidateList}
            value={this.state.candidate}
          />
          <Button primary type="submit" onClick={this.onSubmit}>
            Cast Vote
          </Button>
        </Form>
        {this.message()}
      </div>
    );
  }
}

export default withRouter(Vote);
