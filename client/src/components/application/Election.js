import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Select, Form, Button, Menu, Message } from "semantic-ui-react";
import axios from "axios";
const endpoint = "http://localhost:4000";

class Election extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "",
      admin: "adin",
      contractAddress: "0x5ee338554BFc41eb3127196D47a5eEa85FD3db08",
      account: "",
      consituency: "",
      message: "",
      voterRoute: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.routeChange = this.routeChange.bind(this);
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  routeChange() {
    this.props.history.push(this.state.route);
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmit() {
    axios
      .post(endpoint + "/api/v1/addConsituency/" + this.state.contractAddress, {
        account: 0,
        consituency: this.state.consituency
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
        <Menu>
          <Menu.Item header>
            <h3>Election</h3>
          </Menu.Item>
          <Menu.Item
            position="right"
            name="Vote"
            active={this.state.activeItem === "Vote"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            // position="right"
            name="Result"
            active={this.state.activeItem === "Result"}
            onClick={this.routeChange}
          />
          <Menu.Item
            href={`http://localhost:3000/voterRegistration/${
              this.state.contractAddress
            }`}
            name="RegisterVoter"
            active={this.state.activeItem === "RegisterVoter"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            href={`http://localhost:3000/candidateRegistration/${
              this.state.contractAddress
            }`}
            name="RegisterCandidate"
            active={this.state.activeItem === "RegisterCandidate"}
            onClick={this.handleItemClick}
          />
        </Menu>
        <Message info>
          <Message.Header>admin: {this.state.admin}</Message.Header>
          <p>contract address: {this.state.contractAddress}</p>
        </Message>
        {/* <Select placeholder="Select an account" options={accounts} /> */}

        <Form>
          <Form.Field>
            <label>Add Consituency</label>
            <input
              placeholder="Create Consituency"
              type="text"
              name="consituency"
              onChange={this.onChange}
              value={this.state.consituency}
            />
          </Form.Field>
          <Button primary type="submit" onClick={this.onSubmit}>
            Add Consituency
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

export default Election;
