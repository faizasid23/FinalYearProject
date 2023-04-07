import React, { useRef, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Typography,
  Popper,
  Paper,
  Fade,
  ClickAwayListener
} from "@mui/material";
import { withStyles } from "@mui/styles";

const ActionsDropdown = (props) => {
  let { classes, text } = props;

  const dropdownRef = useRef(null);
  const [state, setState] = useState({ showDropdown: false });

  const handleClose = () => {
    if (state.showDropdown === true) setState({ showDropdown: false });
  };

  return (
    <>
      <div
        className={classes.container}
        ref={dropdownRef}
        onClick={() => setState({ showDropdown: !state.showDropdown })}
      >
        <Typography style={{ textTransform: "capitalize" }}>
          {text !== undefined ? text : "Actions"}
        </Typography>
        <ExpandMoreIcon />
      </div>
      <Popper
        className={classes.popper}
        open={state.showDropdown}
        anchorEl={dropdownRef.current}
        role={undefined}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} disableStrictModeCompat={true}>
            <Paper classes={{ root: classes.dropdownRoot }}>
              <ClickAwayListener
                disableReactTree={state.showDropdown}
                onClickAway={handleClose}
              >
                <div
                  className={classes.actionItemContainer}
                  onClick={handleClose}
                >
                  {props.children}
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

const materialStyles = (theme) => ({
  container: {
    display: "flex",
    width: "8rem",
    boxSizing: "border-box",
    border: "1px solid #ADB5BD",
    height: "3rem",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0rem 0.625rem",
    borderRadius: "0.3125rem",
    cursor: "pointer",
    userSelect: "none",
  },
  popper: { top: "4px !important", zIndex: 10000 },
  dropdownRoot: {
    width: "9.215rem",
    boxSizing: "border-box",
    boxShadow: "0px 0px 6px 8px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  actionItemContainer: {
    "& > *": {
      height: "2.5rem",
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
    },
  },
});

export default withStyles(materialStyles)(ActionsDropdown);