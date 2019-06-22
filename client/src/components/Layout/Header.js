import React from "react";
import { Header } from "semantic-ui-react";
import "../../App.css";

const ElectionHeader = () => {
  return (
    <div className="header">
      <Header as="a" href="/">
        <h2>Voting Project</h2>
      </Header>
    </div>
  );
};

export default ElectionHeader;
