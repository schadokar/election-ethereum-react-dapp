import React, { Component } from "react";
import { Menu, Message } from "semantic-ui-react";
import axios from "axios";
const endpoint = "http://localhost:4000";

class ElectionHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "",
      admin: "",
      contractAddress: "",
      contractName: "",
      account: "",
      consituency: "",
      message: "",
      voterRoute: "",
    };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  async componentDidMount() {
    // set the contract address from the url
    const url = window.location.href;
    await this.setState({
      contractAddress: url.split("/")[url.split("/").length - 1],
    });

    // get the admin of the election

    axios
      .get(endpoint + "/api/v1/getElectionAdmin/" + this.state.contractAddress)
      .then((res) => {
        console.log(res);
        this.setState({ admin: res.data });
      });

    axios
      .get(endpoint + "/api/v1/getElectionName/" + this.state.contractAddress)
      .then((res) => {
        console.log(res);
        this.setState({ contractName: res.data });
      });
  }

  render() {
    return (
      <div>
        <Menu>
          <Menu.Item
            header
            href={`http://localhost:3000/Election/${this.state.contractAddress}`}
          >
            <h3>Election</h3>
          </Menu.Item>
          <Menu.Item
            //  position="right"
            href={`http://localhost:3000/vote/${this.state.contractAddress}`}
            name="Vote"
            active={this.state.activeItem === "Vote"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            // position="right"
            href={`http://localhost:3000/result/${this.state.contractAddress}`}
            name="Result"
            active={this.state.activeItem === "Result"}
            onClick={this.routeChange}
          />

          <Menu.Item
            href={`http://localhost:3000/candidates/${this.state.contractAddress}`}
            name="Candidates"
            active={this.state.activeItem === "Candidates"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            href={`http://localhost:3000/voters/${this.state.contractAddress}`}
            name="Voters"
            active={this.state.activeItem === "Voters"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            href={`http://localhost:3000/voterRegistration/${this.state.contractAddress}`}
            name="RegisterVoter"
            active={this.state.activeItem === "RegisterVoter"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            href={`http://localhost:3000/candidateRegistration/${this.state.contractAddress}`}
            name="RegisterCandidate"
            active={this.state.activeItem === "RegisterCandidate"}
            onClick={this.handleItemClick}
          />
        </Menu>
        <Message info>
          <Message.Header>Election: {this.state.contractName}</Message.Header>
          <p>Admin: {this.state.admin}</p>
          <p>Contract Address: {this.state.contractAddress}</p>
        </Message>
      </div>
    );
  }
}

export default ElectionHeader;
