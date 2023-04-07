import React from "react";
import { Backdrop,  CircularProgress } from "@mui/material";
import { withStyles } from "@mui/styles";

const FullscreenLoader = (props) => {
  let { classes } = props;
  return (
    <Backdrop open={true} className={classes.backdrop}>
      <CircularProgress />
    </Backdrop>
  );
};

const materialStyles = (theme) => ({
  backdrop: {
    zIndex: 9999,
    color: "#fff"
  }
});

export default withStyles(materialStyles)(FullscreenLoader);