import React, { Component } from "react";
import web3 from "../../web3";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: ""
    };
  }

  componentDidMount = async () => {
    this.setState({
      admin: await web3.eth.getAccounts()
    });
    console.log(this.state.admin);
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row header">
          <div className="col-sm-6">
            <h2>Election</h2>
          </div>
          <div className="col-sm-6 admin-address">
            admin address : {this.state.admin}
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
