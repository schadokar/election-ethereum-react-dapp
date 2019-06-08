import React, { Component } from "react";
import { Divider, Form, Button, Message, Card, Input } from "semantic-ui-react";
import axios from "axios";

const endpoint = "http://localhost:4000";
console.log(endpoint);

class CreateElection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountIndex: 0,
      duration: "",
      electionName: "",
      message: "Create new Election",
      electionList: [],
      items: [],
      loading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    this.setState({ loading: true });

    try {
      axios
        .post(endpoint + "/api/v1/newElection", {
          account: this.state.accountIndex,
          duration: parseInt(this.state.duration),
          electionName: this.state.electionName
        })
        .then(res => {
          console.log("------------", res);
          this.setState({
            message: `Transaction Hash: ${res.data.transactionHash}`
          });
          this.getElectionList();
        })
        .catch(err => {
          console.error(err);
        });
    } catch (error) {
      console.log(error);
    }
    this.setState({ loading: false });
  }

  componentDidMount() {
    this.getElectionList();
  }

  getElectionList() {
    axios.get(endpoint + "/api/v1/getElections").then(res => {
      console.log(res.data);
      this.setState({
        electionList: res.data,
        items: res.data.reverse().map(election => {
          console.log("--->", election);
          let card = {
            header: election.electionName,
            description: (
              <a href={`/Election/${election.electionAddress}`}>
                View Election
              </a>
            ),
            meta: `Election Address: ${election.electionAddress}`,
            fluid: true
          };
          return card;
        })
      });
    });
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <Input
              label="minutes"
              labelPosition="right"
              type="text"
              name="duration"
              value={this.state.duration}
              onChange={this.onChange}
              placeholder="Duration of Election in minutes"
            />
          </Form.Field>
          <Form.Field>
            <Input
              type="text"
              name="electionName"
              value={this.state.electionName}
              onChange={this.onChange}
              placeholder="Election Name"
            />
          </Form.Field>
          <Button loading={this.state.loading} primary>
            Create
          </Button>
          <Message info>{this.state.message}</Message>
        </Form>
        <Divider horizontal>Elections</Divider>
        <Card.Group items={this.state.items} />
      </div>
    );
  }
}

export default CreateElection;
