import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { Button, Table } from "semantic-ui-react";
import axios from "axios";
import ElectionHeader from "../layout/Election-Header";
import withRouter from "./withRouter";

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
        <Navigate to={"/voterRegistration/" + this.state.contractAddress} />
      );
    }
  };

  async componentDidMount() {
    // get contract address from URL
    await this.setState({
      contractAddress: this.props.params.address,
    });

    // fetch all voters
    axios
      .get(endpoint + "/api/v1/getVoterList/" + this.state.contractAddress)
      .then(async (res) => {
        let arr = res.data;
        //console.log(res.data);
        let consituencyNames = await Promise.all(
          arr.map((voter) =>
            axios
              .get(
                endpoint +
                  "/api/v1/getConsituency/" +
                  this.state.contractAddress,
                {
                  params: { consituencyId: parseInt(voter.consituencyId) },
                }
              )
              .then((res) => {
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
            voterConsituency: consituencyNames[index], //this.state.consituencyNames[index],
            voterConsituencyId: arr.consituencyId,
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

  voterTable = () => {
    return this.state.voterList.map((voter, index) => {
      return (
        <Table.Row key={index}>
          <Table.Cell>{voter.voterId}</Table.Cell>
          <Table.Cell>{voter.voterName}</Table.Cell>
          <Table.Cell>{voter.voterEmail}</Table.Cell>
          <Table.Cell>{voter.voterPhone}</Table.Cell>
          <Table.Cell>{voter.voterConsituency}</Table.Cell>
          <Table.Cell>{voter.voterConsituencyId}</Table.Cell>
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
              <Table.HeaderCell>Consituency Id</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.voterTable()}</Table.Body>
        </Table>
      </div>
    );
  }
}

export default withRouter(Voters);
