import React from "react";
// for using more than one class
import clsx from "clsx";
import { Typography, CircularProgress } from "@mui/material";
import { withStyles } from "@mui/styles";

const RoundedButton = (props) => {
  let {
    classes,
    isLoading,
    color,
    fullWidth,
    halfWidth,
    square,
    handleSubmit,
    disabled,
    variant = "filled",
    hidden, type, style, tabIndex, children
  } = props;
  disabled = disabled === undefined ? false : disabled;
  isLoading = isLoading === undefined ? false : isLoading;

  return (
    <button
      type={type === "submit" ? "submit" : "button"}
      tabIndex={tabIndex ?? null}
      className={clsx(
        classes.button,
        variant === "outlined" && classes.outlined,
        isLoading && classes.buttonLoading,
        halfWidth && classes.inputHalfWidth,
        fullWidth && classes.fullWidth,
        color === "dark" && classes.dark,
        color === "danger" && classes.danger,
        color === "success" && classes.success,
        square === true && classes.square,
        hidden === true && classes.hidden,
        (disabled || isLoading) && classes.disabled,
        color === "dark" && variant === "outlined" && classes.darkOutlined
      )}
      style={style}
      onClick={disabled === false && isLoading === false ? handleSubmit : () => 1}
    >
      {isLoading ? (
        <CircularProgress size={21} className={classes.loadingIcon} />
      ) : (
        <Typography className={classes.text}>{children}</Typography>
      )}
    </button>
  );
};

const materialStyles = (theme) => ({
  square: {
    borderRadius: "0.2rem !important",
  },
  button: {
    textTransform: "capitalize",
    color: "#fff",
    display: "block",
    width: "100%",
    paddingTop: "0.82rem",
    paddingBottom: "0.82rem",
    borderRadius: "0.325rem",
    boxSizing: "border-box",
    lineHeight: 1,
    backgroundColor: "#006ab3",
    outline: "none",
    border: "none",
    fontSize: "1rem",
    fontWeight: 300,
    minWidth: "8rem",
    maxWidth: "10rem",
    marginBottom: "1.25rem",
    cursor: "pointer",
    transition: theme.transitions.create(["transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shortest,
    }),
    "&.disabled:hover": { transform: "none" },
  },
  inputHalfWidth: {
    width: "calc( 50% - 0.5rem ) "
  },
  buttonLoading: { pointerEvent: "none" },
  loadingIcon: { color: "#fff" },
  text: {
    color: "inherit",
    fontSize: "1rem"
  },
  dark: {
    backgroundColor: "#ACACAC",
  },
  danger: {
    backgroundColor: theme.palette.secondary.main,
  },
  success: {
    backgroundColor: "#50C73E",
  },
  disabled: {
    cursor: "default",
    "&:hover": {
      transform: "none",
    },
  },
  outlined: {
    backgroundColor: "transparent",
    border: "2px solid #C1C336",
    color: "#C1C336",
    boxSizing: "border-box",
  },
  fullWidth: {
    width: "100%",
    maxWidth: "none",
  },
  darkOutlined: {
    border: "2px solid #8C8C8C !important",
    color: "#8C8C8C !important",
    backgroundColor: "#fff",
  },
  hidden: { visibility: "hidden" }
});

export default withStyles(materialStyles)(RoundedButton);