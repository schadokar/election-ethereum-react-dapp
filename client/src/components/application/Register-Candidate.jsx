import React, { Component } from "react";
import { Form, Button, Dropdown, Message } from "semantic-ui-react";
import axios from "axios";
import ElectionHeader from "../layout/Election-Header";
import withRouter from "./withRouter";

const endpoint = "http://localhost:4000";

class RegisterCandidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: "",
      accounts: [],
      consituencyList: [],
      candidateParty: "",
      contractAddress: "",
      candidateAddress: "",
      candidateName: "",
      candidateEmail: "",
      candidatePhone: "",
      candidateConsituency: "",
      message: "",
      value: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    // this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    // set the contract address from the url
    await this.setState({
      contractAddress: this.props.params.address,
    });

    // get the ethereum accounts
    axios.get(endpoint + "/api/v1/accounts").then((res) => {
      // console.log(res);
      let arr = res.data;
      //  console.log(typeof arr, arr);
      this.setState({
        accounts: arr.map((arr, index) => ({
          key: index,
          text: arr,
          value: arr,
        })),
      });
      // console.log(this.state.accounts);
    });

    // get the available consituency List
    axios
      .get(
        endpoint + "/api/v1/getConsituencyList/" + this.state.contractAddress
      )
      .then((res) => {
        //  console.log(res);
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
      .post(endpoint + "/api/v1/addCandidate/" + this.state.contractAddress, {
        account: this.state.admin,
        candidateId: this.state.candidateAddress,
        name: this.state.candidateName,
        email: this.state.candidateEmail,
        phoneNo: this.state.candidatePhone,
        consituency: this.state.candidateConsituency,
        party: this.state.candidateParty,
      })
      .then((res) => {
        console.log(res);
        if (res.data.status)
          this.setState({
            message: `${res.data.message}! TxHash: ${res.data.transactionHash}`,
          });
        else {
          this.setState({
            message: `${res.data.message}! `,
          });
        }
      })
      .catch((err) => {
        console.error("status:", err.status);
        console.error("info:", err.message);
        console.error("error:", err.error);
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
            placeholder="Candidate Id"
            name="candidateAddress"
            label="Candidate Id"
            control={Dropdown}
            fluid
            selection
            onChange={this.handleChange}
            options={this.state.accounts}
            value={this.state.candidateAddress}
          />
          <Form.Field>
            <label>Party</label>
            <input
              placeholder="Candidate Party"
              type="text"
              name="candidateParty"
              onChange={this.onChange}
              value={this.state.candidateParty}
            />
          </Form.Field>
          <Form.Field>
            <label>Name</label>
            <input
              placeholder="Candidate Name"
              type="text"
              name="candidateName"
              onChange={this.onChange}
              value={this.state.candidateName}
            />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input
              placeholder="Candidate Email"
              type="text"
              name="candidateEmail"
              onChange={this.onChange}
              value={this.state.candidateEmail}
            />
          </Form.Field>
          <Form.Field>
            <label>Phone no.</label>
            <input
              placeholder="Candidate Phone"
              type="text"
              name="candidatePhone"
              onChange={this.onChange}
              value={this.state.candidatePhone}
            />
          </Form.Field>
          <Form.Field
            label="Consituency"
            placeholder="Candidate Consituency"
            control={Dropdown}
            fluid
            selection
            name="candidateConsituency"
            onChange={this.handleChange}
            options={this.state.consituencyList}
            value={this.state.candidateConsituency}
          />

          <Button primary type="submit" onClick={this.onSubmit}>
            Register
          </Button>
          <Message info header="Message" content={this.state.message} />
        </Form>
      </div>
    );
  }
}

export default withRouter(RegisterCandidate);
