import React from "react";
import { Typography } from "@mui/material";
import { withStyles } from "@mui/styles";

const ActionItem = (props) => {
  let { text, handleClick, classes } = props;

  return (
    <div
      className={classes.container}
      onClick={handleClick}
    >
      <Typography>{text}</Typography>
    </div >
  );
};

const materialStyles = () => ({
  container: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    padding: "4px 1rem",
    "&:hover": {
      backgroundColor: "#ECEDF5"
    }
  }
});

export default withStyles(materialStyles)(ActionItem);