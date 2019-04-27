import React, { Component } from "react";
import { Divider, Form, Button, Message } from "semantic-ui-react";
import axios from "axios";

const endpoint = "http://localhost:4000";
console.log(endpoint);

class CreateElection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountIndex: 0,
      duration: "",
      message: "Create new Election"
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    axios
      .post(endpoint + "/api/v1/newElection", {
        account: this.state.accountIndex,
        duration: parseInt(this.state.duration)
      })
      .then(res => {
        console.log("------------", res);
        this.setState({
          message: `Transaction Hash: ${res.data.transactionHash}`
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        <Form>
          <Form.Field>
            <input
              type="text"
              name="duration"
              value={this.state.duration}
              onChange={this.onChange}
              placeholder="Duration of Election in minutes"
            />
          </Form.Field>
          <Button primary type="submit" onClick={this.onSubmit}>
            Create
          </Button>
          <Message info>{this.state.message}</Message>
        </Form>
        <Divider horizontal />
      </div>
    );
  }
}

export default CreateElection;
