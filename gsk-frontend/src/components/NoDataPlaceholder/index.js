import React from "react";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Typography } from "@mui/material";
import { withStyles } from '@mui/styles';

function NoDataPlaceholder(props) {
  let { children, classes } = props;

  return (
    <div className={classes.container} style={props.style}>
      <ManageSearchIcon class={classes.icon} />
      <Typography class={classes.message}>{children}</Typography>
    </div>
  );
}

const materialStyles = (theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "18rem",
    backgroundColor: "#fff",
    borderRadius: "0.5rem ",
  },
  icon: { width: 100, height: 100, fill: theme.palette.secondary.main }
});

export default withStyles(materialStyles)(NoDataPlaceholder);
