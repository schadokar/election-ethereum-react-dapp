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
        this.setState({
          voterList: arr.map(arr => ({
            key: arr,
            text: arr,
            value: arr
          }))
        });
      });

    // fetch all candidates
    axios
      .get(endpoint + "/api/v1/getCandidateList/" + this.state.contractAddress)
      .then(res => {
        let arr = res.data;
        this.setState({
          candidateList: arr.map(arr => ({
            key: arr,
            text: arr,
            value: arr
          }))
        });
      });
  }

  handleChange(e, result) {
    const { name, value } = result;
    this.setState({
      [name]: value
    });
    console.log(result.value, result.name);
  }

  onSubmit() {
    axios
      .post(endpoint + "/api/v1/castVote/" + this.state.contractAddress, {
        voterId: this.state.voter,
        candidateId: this.state.candidate
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
