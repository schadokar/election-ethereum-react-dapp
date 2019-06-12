import React, { Component } from "react";
import { Form, Dropdown, Button, Message } from "semantic-ui-react";
import axios from "axios";
import ElectionHeader from "../layout/Election-Header";

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
      message: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    // get contract address from URL
    const url = window.location.href;
    await this.setState({
      contractAddress: url.split("/")[url.split("/").length - 1]
    });

    // fetch all voters
    axios
      .get(endpoint + "/api/v1/getVoterList/" + this.state.contractAddress)
      .then(res => {
        let arr = res.data;
        console.log(res.data);
        this.setState({
          voterList: arr.map(arr => ({
            key: arr.voterId,
            text: arr.name,
            value: arr.voterId
          }))
        });
      });
  }

  async handleChange(e, result) {
    const { name, value } = result;
    this.setState({
      [name]: value
    });
    console.log(result.value, result.name);
    // get voters consituency

    if (result.name === "voter") {
      await axios
        .get(endpoint + "/api/v1/getVoter/" + this.state.contractAddress, {
          params: {
            voterId: result.value
          }
        })
        .then(res => {
          console.log(res, "cons id");
          this.setState({
            consituencyId: parseInt(res.data.consituencyId)
          });
        });
      await axios
        .get(
          endpoint +
            "/api/v1/getVoterConsituencyCandidates/" +
            this.state.contractAddress,
          {
            params: {
              voterId: result.value,
              consituencyId: this.state.consituencyId
            }
          }
        )
        .then(async res => {
          console.log("res", this.state.consituencyId);
          let candidateList = res.data.candidateList.map(candidateId =>
            axios
              .get(
                endpoint + "/api/v1/getCandidate/" + this.state.contractAddress,
                {
                  params: { candidateId: candidateId }
                }
              )
              .then(res => {
                return res.data;
              })
          );
          candidateList = await Promise.all(candidateList);
          this.setState({
            candidateList: candidateList.map(candidate => ({
              key: candidate.candidateId,
              text: candidate.name,
              value: candidate.candidateId
            }))
          });
        });
    }
  }

  onSubmit() {
    axios
      .post(endpoint + "/api/v1/castVote/" + this.state.contractAddress, {
        voterId: this.state.voter,
        consituencyId: this.state.consituencyId,
        candidateId: this.state.candidate
      })
      .then(res => {
        console.log(res);
        this.setState({
          message: `Vote casted Successfully!\n TxHash: ${
            res.data.transactionHash
          }`
        });
      });
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
        <Message info>
          <Message.Header>
            <p>{this.state.message}</p>
          </Message.Header>
        </Message>
      </div>
    );
  }
}

export default Vote;
