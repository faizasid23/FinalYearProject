import React, { useState } from "react";
import clsx from "clsx";
import {
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const SuccessModal = (props) => {
  let { handleCancel, heading, message, name, buttonText, classes } = props;

  const [isLoading, setLoading] = useState(false);

  const handleModalSumbit = () => {
    setLoading(true);
    props.handleSubmit();
  };

  return (
    <Dialog
      open={true}
      onClose={handleCancel}
      classes={{ paper: classes.root }}
    >
      <DialogTitle className={classes.head}>
        <div className={classes.headInner}>
          <Typography> {heading}</Typography>
          <IconButton onClick={handleCancel}>
            <CancelOutlinedIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className={classes.body}>
          <Typography> {message} </Typography>
          <Typography style={{ fontWeight: 500 }}>{name}</Typography>
        </div>
        {/* Footer */}
        <div className={classes.footer}>
          <div
            className={classes.controlButtons}
            style={{ backgroundColor: "#fff", border: "1px solid #8C8C8C" }}
            onClick={handleCancel}
          >
            <Typography
              className={classes.buttonText}
              style={{ color: "#8C8C8C", fontWeight: 500 }}
            >
              Cancel
            </Typography>
          </div>
          <div
            style={{ marginLeft: "auto" }}
            className={clsx(
              classes.controlButtons,
              isLoading === true && classes.disabled
            )}
            onClick={isLoading === false ? handleModalSumbit : () => 1}
          >
            {isLoading ? (
              <CircularProgress color="inherit" style={{ width: "2rem" }} />
            ) : (
              <Typography className={classes.buttonText}>
                {buttonText}
              </Typography>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const materialStyles = (theme) => ({
  root: { maxWidth: "28rem", minWidth: "22rem" },
  head: {
    paddingTop: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #DEE2E6",
    "& p": {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: theme.palette.primary.main,
    },
  },
  headInner: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: "1rem",
    paddingBottom: "1.25rem",
    "&:first-child": { marginBottom: "1.5rem", textAlign: "center" },
    "&:nth-child(2)": { marginBottom: "1.5rem" },
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  controlButtons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
    maxWidth: "10rem",
    minWidth: "4rem",
    padding: "0 2rem",
    height: "3.25rem",
    backgroundColor: theme.palette.primary.main,
    textAlign: "center",
    color: "#fff",
    borderRadius: "0.3125rem",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    marginBottom: "",
    transition: "0.2s ease-in-out",
    "&:hover": {
      transform: "translate(0,-4px)",
    },
  },
  buttonText: {
    userSelect: "none",
    fontWeight: 500,
    fontSize: "1.125rem",
  },
});

export default withStyles(materialStyles)(SuccessModal);