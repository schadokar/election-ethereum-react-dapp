import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Table } from "semantic-ui-react";
import axios from "axios";
import ElectionHeader from "../layout/Election-Header";

const endpoint = "http://localhost:4000";

class Candidates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      candidateList: [],
      contractAddress: "",
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
        <Redirect to={"/candidateRegistration/" + this.state.contractAddress} />
      );
    }
  };

  async componentDidMount() {
    // get contract address from URL
    const url = window.location.href;
    await this.setState({
      contractAddress: url.split("/")[url.split("/").length - 1]
    });

    // fetch all candidates
    axios
      .get(endpoint + "/api/v1/getCandidateList/" + this.state.contractAddress)
      .then(res => {
        let arr = res.data;
        //console.log(res.data);
        arr.map(candidate => {
          axios
            .get(
              endpoint + "/api/v1/getConsituency/" + this.state.contractAddress,
              {
                params: { consituencyId: parseInt(candidate.consituencyId) }
              }
            )
            .then(res => {
              this.setState({
                candidateList: arr.map(arr => ({
                  candidateId: arr.candidateId,
                  candidateName: arr.name,
                  candidateEmail: arr.email,
                  candidatePhone: arr.phoneNo,
                  candidateConsituency: arr.consituencyId
                }))
              });
            });
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

  candidateTable = () => {
    return this.state.candidateList.map((candidate, index) => {
      return (
        <Table.Row key={index}>
          <Table.Cell>{candidate.candidateId}</Table.Cell>
          <Table.Cell>{candidate.candidateName}</Table.Cell>
          <Table.Cell>{candidate.candidateEmail}</Table.Cell>
          <Table.Cell>{candidate.candidatePhone}</Table.Cell>
          <Table.Cell>{candidate.candidateConsituency}</Table.Cell>
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
          New candidate
        </Button>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>candidate Id</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Phone No</Table.HeaderCell>
              <Table.HeaderCell>Consituency</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.candidateTable()}</Table.Body>
        </Table>
      </div>
    );
  }
}

export default Candidates;
