import React, { Component } from "react";

class ListOfAccounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfAccounts: []
        };
    }

    componentDidMount = async () => {
        this.setState({
            listOfAccounts: [1,2,4,3,5,3,43,2345]
        });

        console.log(this.state.listOfAccounts);
    }

    render() {
        return(
            <div className="list-of-accounts">
                {this.state.listOfAccounts.map((account) => 
                    <div> {account} </div>
                )}
            </div>
        );
    }
}

export default ListOfAccounts;