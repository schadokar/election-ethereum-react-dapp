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
      message: "",
      electionList: [],
      items: [],
      loading: false,
      loadingDeploy: false,
      loadingCompile: false,
      messageType: "info",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.compile = this.compile.bind(this);
    this.deploy = this.deploy.bind(this);
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
          electionName: this.state.electionName,
        })
        .then((res) => {
          console.log("------------", res);
          this.setState({
            message: `Transaction Hash: ${res.data.transactionHash}`,
            messageType: "info",
            loading: false,
          });
          this.getElectionList();
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  compile() {
    this.setState({ loadingCompile: true });
    axios.post(endpoint + "/contract/compile").then((res) => {
      console.log(res.data);
      this.setState({
        message: res.data,
        messageType: "info",
        loadingCompile: false,
      });
    });
  }

  deploy() {
    this.setState({ loadingDeploy: true });
    axios.post(endpoint + "/contract/deploy").then((res) => {
      console.log(res.data);
      this.setState(
        {
          message: `Contract deployed Successfully! Address: ${res.data.address}`,
          messageType: "info",
          loadingDeploy: false,
          electionList: [],
        },
        () => {
          this.getElectionList();
        }
      );
    });
  }

  message() {
    if (this.state.message.length) {
      const type = this.state.messageType;
      return <Message color={type}>{this.state.message}</Message>;
    }
  }
  componentDidMount() {
    this.getElectionList();
  }

  getElectionList() {
    axios.get(endpoint + "/api/v1/getElections").then((res) => {
      console.log(res.data);
      this.setState({
        electionList: res.data,
        items: res.data.reverse().map((election) => {
          // console.log("--->", election);
          let card = {
            header: election.electionName,
            description: (
              <a href={`/Election/${election.electionAddress}`}>
                View Election
              </a>
            ),
            meta: `Election Address: ${election.electionAddress}`,
            fluid: true,
          };
          return card;
        }),
      });
    });
  }

  render() {
    return (
      <div>
        <div style={{ paddingBottom: "10px" }}>
          <Button
            loading={this.state.loadingCompile}
            onClick={this.compile}
            primary
          >
            Compile Contract
          </Button>
          <Button
            loading={this.state.loadingDeploy}
            onClick={this.deploy}
            primary
          >
            Deploy Election Factory Contract
          </Button>
        </div>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <Input
              label="minutes"
              labelPosition="right"
              type="number"
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
          {this.message()}
        </Form>
        <Divider horizontal>Elections</Divider>
        <Card.Group items={this.state.items} />
      </div>
    );
  }
}

export default CreateElection;
