import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { Button, Table } from "semantic-ui-react";
import axios from "axios";
import ElectionHeader from "../layout/Election-Header";
import withRouter from "./withRouter";

const endpoint = "http://localhost:4000";

class Candidates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      candidateList: [],
      contractAddress: "",
      message: "",
      value: "",
    };

    this.onChange = this.onChange.bind(this);
    // /this.onSubmit = this.onSubmit.bind(this);
  }

  setNavigate = () => {
    this.setState({
      redirect: true,
    });
  };
  renderNavigate = () => {
    if (this.state.redirect) {
      return (
        <Navigate to={"/candidateRegistration/" + this.state.contractAddress} />
      );
    }
  };

  async componentDidMount() {
    // get contract address from URL
    await this.setState({
      contractAddress: this.props.params.address,
    });

    // fetch all candidates
    await axios
      .get(endpoint + "/api/v1/getCandidateList/" + this.state.contractAddress)
      .then(async (res) => {
        let arr = res.data;
        console.log(res.data, "<-----------<");
        let consituencyNames = await Promise.all(
          arr.map((candidate) =>
            axios
              .get(
                endpoint +
                  "/api/v1/getConsituency/" +
                  this.state.contractAddress,
                {
                  params: { consituencyId: parseInt(candidate.consituencyId) },
                }
              )
              .then((res) => {
                return res.data.name;
              })
          )
        );

        this.setState({
          candidateList: arr.map((candidate, index) => ({
            candidateId: candidate.candidateId,
            candidateName: candidate.name,
            candidateEmail: candidate.email,
            candidatePhone: candidate.phoneNo,
            candidateConsituency: consituencyNames[index],
            candidateConsituencyId: candidate.consituencyId,
            candidateParty: candidate.party,
          })),
        });
      });
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleChange = (e, result) => {
    const { name, value } = result;
    this.setState({
      [name]: value,
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
          <Table.Cell>{candidate.candidateConsituencyId}</Table.Cell>
          <Table.Cell>{candidate.candidateParty}</Table.Cell>
        </Table.Row>
      );
    });
  };
  render() {
    return (
      <div>
        <ElectionHeader />
        {this.renderNavigate()}
        <Button
          floated="right"
          primary
          type="submit"
          onClick={this.setNavigate}
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
              <Table.HeaderCell>Consituency Id</Table.HeaderCell>
              <Table.HeaderCell>Party</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.candidateTable()}</Table.Body>
        </Table>
      </div>
    );
  }
}

export default withRouter(Candidates);
