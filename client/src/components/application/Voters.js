import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Table } from "semantic-ui-react";
import axios from "axios";
import ElectionHeader from "../layout/Election-Header";

const endpoint = "http://localhost:4000";

class Voters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      voterList: [],
      contractAddress: "",
      consituencyNames: [],
      message: "",
      value: ""
    };

    this.onChange = this.onChange.bind(this);
    // /this.onSubmit = this.onSubmit.bind(this);
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return (
        <Redirect to={"/voterRegistration/" + this.state.contractAddress} />
      );
    }
  };

  async componentDidMount() {
    // get contract address from URL
    const url = window.location.href;
    await this.setState({
      contractAddress: url.split("/")[url.split("/").length - 1]
    });

    // fetch all voters
    axios
      .get(endpoint + "/api/v1/getVoterList/" + this.state.contractAddress)
      .then(async res => {
        let arr = res.data;
        //console.log(res.data);
        let consituencyNames = await Promise.all(
          arr.map(voter =>
            axios
              .get(
                endpoint +
                  "/api/v1/getConsituency/" +
                  this.state.contractAddress,
                {
                  params: { consituencyId: parseInt(voter.consituencyId) }
                }
              )
              .then(res => {
                return res.data.name;
              })
          )
        );

        // console.log(consituencyNames);
        this.setState({
          voterList: arr.map((arr, index) => ({
            voterId: arr.voterId,
            voterName: arr.name,
            voterEmail: arr.email,
            voterPhone: arr.phoneNo,
            voterConsituency: consituencyNames[index] //this.state.consituencyNames[index]
          }))
        });
      });
  }
  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleChange = (e, result) => {
    const { name, value } = result;
    this.setState({
      [name]: value
    });

    console.log(result.value, result.name);
  };

  voterTable = () => {
    return this.state.voterList.map((voter, index) => {
      return (
        <Table.Row key={index}>
          <Table.Cell>{voter.voterId}</Table.Cell>
          <Table.Cell>{voter.voterName}</Table.Cell>
          <Table.Cell>{voter.voterEmail}</Table.Cell>
          <Table.Cell>{voter.voterPhone}</Table.Cell>
          <Table.Cell>{voter.voterConsituency}</Table.Cell>
        </Table.Row>
      );
    });
  };
  render() {
    return (
      <div>
        <ElectionHeader />
        {this.renderRedirect()}
        <Button
          floated="right"
          primary
          type="submit"
          onClick={this.setRedirect}
        >
          New Voter
        </Button>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Voter Id</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Phone No</Table.HeaderCell>
              <Table.HeaderCell>Consituency</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.voterTable()}</Table.Body>
        </Table>
      </div>
    );
  }
}

export default Voters;
