import React, { useRef, useState } from "react";
import {
  IconButton, Tooltip,
  Popper, Paper,
  Fade, ClickAwayListener
} from "@mui/material";
import { withStyles } from "@mui/styles";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

const Actions = (props) => {
  let { classes, children } = props;

  const dropdownRef = useRef(null);
  const [state, setState] = useState({ showDropdown: false });

  const handleClose = () => {
    if (state.showDropdown === true) setState({ showDropdown: false });
  };

  return (
    <>
      <Tooltip title="Actions">
        {/* {icon ? (
          <div
            ref={dropdownRef}
            onClick={(e) => {
              e.stopPropagation();
              setState({ showDropdown: !state.showDropdown });
            }}
          >
            {icon}
          </div>
        ) : ( */}
        <IconButton
          className={classes.actionButton}
          ref={dropdownRef}
          onClick={() => setState({ showDropdown: !state.showDropdown })}
        >
          <MoreHorizOutlinedIcon />
        </IconButton>
        {/* )} */}
      </Tooltip>
      <Popper
        className={classes.popper}
        open={state.showDropdown}
        anchorEl={dropdownRef.current}
        role={undefined}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper classes={{ root: classes.dropdownRoot }}>
              <ClickAwayListener
                disableReactTree={state.showDropdown}
                onClickAway={handleClose}
              >
                <div
                  className={classes.actionItemContainer}
                  onClick={handleClose}
                >
                  {children}
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
  popper: { top: "4px !important", zIndex: 10000 },
  actionButton: {
    backgroundColor: "#ECEDF5",
    padding: 10
  },
  dropdownRoot: {
    width: "auto",
    minWidth: "10rem",
    boxSizing: "border-box",
    boxShadow: "0px 0px 6px 8px rgba(0,0,0,0.05)",
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: { minWidth: "8rem" },
  },
  actionItemContainer: {
    "& > *": {
      height: "2.5rem",
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }
});

export default withStyles(materialStyles)(Actions);