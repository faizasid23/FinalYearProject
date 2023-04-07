import React, { Component } from "react";
import { withStyles } from "@mui/styles";
import Footer from "../Footer";

// A Higher order component that wraps the children component 
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { classes } = this.props;
    return (
      <>
        <div className={classes.container}>
          {this.props.children}
        </div>
        <Footer inside={true} />
      </>
    );
  }
}

const MaterialStyles = (theme) => ({
  container: {
    marginLeft: "18%",
    paddingTop: "5rem",
    paddingLeft: "3rem",
    paddingRight: "3rem",
    '& > :first-child': {
      maxWidth: 1160,
      width: '100%'
    }
  }
});

export default withStyles(MaterialStyles)(Main);
