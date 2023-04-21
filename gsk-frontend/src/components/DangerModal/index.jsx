import React, { useState } from "react";
import clsx from "clsx";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  ButtonBase,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import RoundedButton from "../RoundedButton";

const DangerModal = (props) => {
  let {
    handleCancel,
    heading,
    message,
    name,
    buttonText,
    responseAsync,
    classes,
  } = props;

  const [isLoading, setLoading] = useState(false);

  const handleModalSumbit = () => {
    setLoading(true);
    if (responseAsync === false) props.handleSubmit();
    else {
      props.handleSubmit(handleCancel).then((response) => {
        if (response === false) setLoading(false);
      });
    }
  };

  return (
    <Dialog open={true} onClose={handleCancel}>
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
          {props.children !== undefined ? (
            props.children
          ) : (
            <>
              <Typography> {message} </Typography>
              <Typography style={{ fontWeight: 500 }}>{name}</Typography>
            </>
          )}
        </div>
        {/* Footer */}
        <div className={classes.footer}>
          <div>
            <RoundedButton
              handleSubmit={handleCancel}
              square={true}
              color="dark"
            >
              Cancel
            </RoundedButton>
          </div>
          <div>
            <ButtonBase
              onClick={isLoading ? () => 1 : handleModalSumbit}
              class={clsx(classes.controlButtons,
                isLoading === true && classes.disabled
              )}
            >
              {isLoading ? (
                <CircularProgress style={{ width: "2.5rem" }} color="inherit" />
              ) : (
                <Typography className={classes.buttonText}>
                  {buttonText}
                </Typography>
              )}
            </ButtonBase>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const materialStyles = (theme) => ({
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
    height: "6.25rem",
    minWidth: "20rem",
    maxWidth: "25rem",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  controlButtons: {
    minWidth: "8rem",
    height: "3.25rem",
    backgroundColor: "#FC443E",
    color: "#fff",
    borderRadius: "0.3125rem",
    cursor: "pointer",
    userSelect: "none",
    border: 'none'
  },
  buttonText: {
    userSelect: "none",
    fontWeight: 500,
    fontSize: "1.125rem",
  },
});

export default withStyles(materialStyles)(DangerModal);
