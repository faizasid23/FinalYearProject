import React, { useEffect } from "react";
// material ui stuff
import { Typography, Fade } from "@mui/material";
import { withStyles } from "@mui/styles";
// importing configs and assets for ui
import { withRouter } from "../../utils/router";
import RoleSwitch from "../RoleSwitch";
// We are using free illustration images for bg from freepik for aesthetic user experience
import GSK_LOGO from "../../assets/images/GSK_logo.png";
import Footer from "../Footer";

// This is the form container for sign up
const Form = (props) => {
  let { classes } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <form
      noValidate
      className={classes.formContainer}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className={classes.formInner}>
        <div className={classes.textsContainer}>
          <Typography class={classes.loginTitle}>{props.text}</Typography>
          <RoleSwitch role={props.role} onChange={props.handleRoleSwitch} />
        </div>
        {props.children}
      </div>
    </form>
  );
};

const formStyles = (theme) => ({
  formContainer: {
    width: "50%",
    padding: "2rem 4.75rem",
    display: "flex",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  formInner: {
    width: "100%",
    minHeight: "32rem",
    maxWidth: "28rem",
    padding: "2rem 2.25rem 2rem 2.25rem",
    boxShadow: "0px 2px 8px 3px rgba(0,0,0,0.1)",
    borderRadius: "0.425rem",
    backgroundColor: "#fff",
    alignSelf: 'center'
  },
  textsContainer: {
    marginBottom: "2.25rem",
    textAlign: 'center'
  },
  loginTitle: {
    fontSize: "2.0rem",
    fontWeight: 500,
    marginBottom: "1rem",
  },
});

export const FormStyled = withStyles(formStyles)(Form);

// This container renders the whole screen for login
const LoginContainer = (props) => {
  let { classes } = props;
  let { role, text, handleRoleSwitch } = props;

  return (
    <>
      <div className={classes.container}>
        <FormStyled role={role} text={text} handleRoleSwitch={handleRoleSwitch}>
          {props.children}
        </FormStyled>
        <div className={classes.sliderContainer}>
          {/* images slider */}
          <div className={classes.imageContainer}>
            <div className={classes.absoluteContent}></div>
            <img alt="GSK Logo" src={GSK_LOGO} width='500' />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const containerStyles = (theme) => ({
  container: {
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#fff"
  },
  // images slider
  sliderContainer: {
    width: "50%",
    height: "100vh",
    right: 0,
    display: "flex",
    backgroundColor: '#fff'
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    display: "flex",
    position: "relative"
  }
});

export default withRouter(withStyles(containerStyles)(LoginContainer));