import React, { Component } from "react";
import { Form, Button, Menu, Message } from "semantic-ui-react";
import axios from "axios";
import ElectionHeader from "../layout/Election-Header";

const endpoint = "http://localhost:4000";

class Election extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "",
      contractAddress: "",
      account: "",
      consituencyId: "",
      consituencyName: "",
      message: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    // set the contract address from the url
    const url = window.location.href;
    await this.setState({
      contractAddress: url.split("/")[url.split("/").length - 1]
    });
    // console.log(url.split("/")[url.split("/").length - 1]);
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmit() {
    axios
      .post(endpoint + "/api/v1/addConsituency/" + this.state.contractAddress, {
        account: 0,
        consituencyId: this.state.consituencyId,
        consituencyName: this.state.consituencyName
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
          <Form.Field>
            <label>Add Consituency</label>
            <input
              placeholder="Consituency ID"
              type="text"
              name="consituencyId"
              onChange={this.onChange}
              value={this.state.consituencyId}
            />
          </Form.Field>
          <Form.Field>
            <label>Consituency Name</label>
            <input
              placeholder="Consituency Name"
              type="text"
              name="consituencyName"
              onChange={this.onChange}
              value={this.state.consituencyName}
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
