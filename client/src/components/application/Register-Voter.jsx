import React, { Component } from "react";
import { Form, Button, Dropdown, Message } from "semantic-ui-react";
import axios from "axios";
import ElectionHeader from "../layout/Election-Header";
import withRouter from "./withRouter";

const endpoint = "http://localhost:4000";

class RegisterVoter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: "",
      accounts: [],
      consituencyList: [],
      contractAddress: "",
      voterAddress: "",
      voterName: "",
      voterEmail: "",
      voterPhone: "",
      voterConsituency: "",
      voterAge: "",
      message: "",
      value: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    // set the contract address from the url
    await this.setState({
      contractAddress: this.props.params.address,
    });

    // get the ethereum accounts
    axios.get(endpoint + "/api/v1/accounts").then((res) => {
      let arr = res.data;
      this.setState({
        accounts: arr.map((arr, index) => ({
          key: index,
          text: arr,
          value: arr,
        })),
      });
    });

    // get the available consituency List
    axios
      .get(
        endpoint + "/api/v1/getConsituencyList/" + this.state.contractAddress
      )
      .then((res) => {
        console.log(res);
        let arr = res.data;
        this.setState({
          consituencyList: arr.map((arr) => ({
            key: arr.consituencyId,
            text: `${arr.consituencyId} | ${arr.name}`,
            value: arr.consituencyId,
          })),
        });
      });
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onSubmit() {
    axios
      .post(endpoint + "/api/v1/addVoter/" + this.state.contractAddress, {
        account: this.state.admin,
        voterId: this.state.voterAddress,
        name: this.state.voterName,
        email: this.state.voterEmail,
        phoneNo: this.state.voterPhone,
        consituency: this.state.voterConsituency,
        age: this.state.voterAge,
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

  handleChange = (e, result) => {
    const { name, value } = result;
    this.setState({
      [name]: value,
    });

    console.log(result.value, result.name);
  };

  render() {
    return (
      <div>
        <ElectionHeader />
        <Form>
          <Form.Field
            placeholder="Admin Id"
            name="admin"
            label="Admin Id"
            control={Dropdown}
            fluid
            selection
            onChange={this.handleChange}
            options={this.state.accounts}
            value={this.state.admin}
          />
          <Form.Field
            placeholder="Voter ID"
            name="voterAddress"
            label="Voter ID"
            control={Dropdown}
            fluid
            selection
            onChange={this.handleChange}
            options={this.state.accounts}
            value={this.state.voterAddress}
          />
          <Form.Field>
            <label>Name</label>
            <input
              placeholder="voter Name"
              type="text"
              name="voterName"
              onChange={this.onChange}
              value={this.state.voterName}
            />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input
              placeholder="voter Email"
              type="text"
              name="voterEmail"
              onChange={this.onChange}
              value={this.state.voterEmail}
            />
          </Form.Field>
          <Form.Field>
            <label>Phone no.</label>
            <input
              placeholder="voter Phone"
              type="text"
              name="voterPhone"
              onChange={this.onChange}
              value={this.state.voterPhone}
            />
          </Form.Field>
          <Form.Field
            label="Consituency"
            placeholder="Voter Consituency"
            control={Dropdown}
            fluid
            selection
            name="voterConsituency"
            onChange={this.handleChange}
            options={this.state.consituencyList}
            value={this.state.voterConsituency}
          />
          <Form.Field>
            <label>Age</label>
            <input
              placeholder="voter age"
              type="text"
              name="voterAge"
              onChange={this.onChange}
              value={this.state.voterAge}
            />
          </Form.Field>
          <Button primary type="submit" onClick={this.onSubmit}>
            Register
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

export default withRouter(RegisterVoter);
