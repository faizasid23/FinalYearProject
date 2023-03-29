import React from "react";
import clsx from "clsx";
// material UI stuff
import { Typography } from "@mui/material";
import { withStyles } from "@mui/styles";

const RoleSwitch = (props) => {
  let { classes, role, onChange } = props;

  return (
    <div className={classes.container} onClick={onChange}>
      <div
        className={clsx(role === "manager" && classes.selected, classes.item)}
      >
        <Typography>Manager</Typography>
      </div>
      <div
        className={clsx(role === "student" && classes.selected, classes.item)}
      >
        <Typography>Student</Typography>
      </div>
    </div>
  );
};

// Styling is overriden here
const materialStyles = (theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: '0.325rem',
    overflow: "hidden",
    height: "3rem",
    position: "relative",
  },
  item: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    height: "100%",
    transition: "background 0.25s ease-in",
    cursor: "pointer",
    "& > p": {
      fontSize: "1rem",
      fontWeight: 500,
      color: theme.palette.primary.main,
      transition: "color 0.25s ease-in",
    },
  },
  selected: {
    backgroundColor: theme.palette.primary.main,
    "& > p": {
      color: "#fff",
    },
  }
});

export default withStyles(materialStyles)(RoleSwitch);