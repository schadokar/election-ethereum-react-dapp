import React, { Component } from "react";
import { Form, Button, Message, Table } from "semantic-ui-react";
import axios from "axios";
import ElectionHeader from "../layout/Election-Header";
import withRouter from "./withRouter";
const endpoint = "http://localhost:4000";

class Election extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "",
      contractAddress: "",
      consituencyList: [],
      account: "",
      consituencyId: 0,
      consituencyName: "",
      message: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {
    // set the contract address from the url
    await this.setState({
      contractAddress: this.props.params.address,
    });

    axios
      .get(
        endpoint + "/api/v1/getConsituencyList/" + this.state.contractAddress
      )
      .then((res) => {
        console.log("Consituency: ", res.data);
        this.setState({
          consituencyId: res.data.length + 1,
          consituencyList: res.data.map((consituency) => ({
            consituencyId: consituency.consituencyId,
            consituencyName: consituency.name,
          })),
        });
      });
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async onSubmit() {
    const res = await axios.post(
      endpoint + "/api/v1/addConsituency/" + this.state.contractAddress,
      {
        account: 0,
        consituencyId: this.state.consituencyId,
        consituencyName: this.state.consituencyName,
      }
    );
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

    const consituencyList = await axios.get(
      endpoint + "/api/v1/getConsituencyList/" + this.state.contractAddress
    );

    this.setState({
      consituencyId: consituencyList.data.length + 1,
      consituencyList: consituencyList.data.map((consituency) => ({
        consituencyId: consituency.consituencyId,
        consituencyName: consituency.name,
      })),
    });
  }

  message() {
    if (this.state.message.length)
      return (
        <Message info>
          <Message.Header>
            <p>{this.state.message}</p>
          </Message.Header>
        </Message>
      );
  }

  consituencyTable() {
    if (this.state.consituencyList.length > 0) {
      const { Header, HeaderCell, Row } = Table;
      return (
        <Table>
          <Header>
            <Row>
              <HeaderCell>Consituency Id</HeaderCell>
              <HeaderCell>Consituency Name</HeaderCell>
            </Row>
          </Header>
          <Table.Body>{this.consituencyBody()}</Table.Body>
        </Table>
      );
    }
  }

  consituencyBody() {
    const { Row, Cell } = Table;
    return this.state.consituencyList.map((consituency, index) => {
      return (
        <Row key={index}>
          <Cell>{consituency.consituencyId}</Cell>
          <Cell>{consituency.consituencyName}</Cell>
        </Row>
      );
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
              readOnly
              placeholder="Consituency ID"
              type="number"
              name="consituencyId"
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

        {this.message()}
        {this.consituencyTable()}
      </div>
    );
  }
}

export default withRouter(Election);
