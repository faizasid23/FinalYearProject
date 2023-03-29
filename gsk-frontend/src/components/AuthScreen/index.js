import React, { useEffect } from "react";
// material ui stuff
import { Typography, Fade } from "@mui/material";
import { withStyles } from "@mui/styles";
// importing configs and assets for ui
import { withRouter } from "../../utils/router";
import RoleSwitch from "../RoleSwitch";
// We are using free illustration images for bg from freepik for aesthetic user experience
import StudentView from "../../assets/images/student.jpg";
import ManagerView from "../../assets/images/manager.jpg";

// This is the form container for sign up
const Form = (props) => {
  let { classes } = props;

  useEffect(() => {
    document.querySelector("body").className = "white-bc";
    return () => document.querySelector("body").classList.remove("white-bc");
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
    height: "100%",
    padding: "2rem 4.75rem",
    display: "flex",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  formInner: {
    width: "100%",
    maxWidth: "31rem",
  },
  textsContainer: {
    marginBottom: "2.25rem",
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
    <div className={classes.container}>
      <FormStyled role={role} text={text} handleRoleSwitch={handleRoleSwitch}>
        {props.children}
      </FormStyled>
      <div className={classes.sliderContainer}>
        {/* images slider */}
        <div className={classes.imageContainer}>
          <div className={classes.absoluteContent}></div>
          <Fade in={role === "manager" || role === "student"} key={role}>
            {role === "manager" ? (
              // <a href="https://www.freepik.com/free-vector/businessman-concept-illustration_6610839.htm#query=manager&position=1&from_view=search&track=sph#position=1&query=manager">Image by storyset</a> on Freepik
              <img alt="Manager Illustration" src={ManagerView} width='500' />
            ) : (
              // <a href="https://www.freepik.com/free-vector/learning-concept-illustration_14230944.htm#query=student&position=1&from_view=search&track=sph">Image by storyset</a> on Freepik
              <img alt="Student Illustration" src={StudentView} width='500' />
            )}
          </Fade>
        </div>
      </div>
    </div>
  );
};

const containerStyles = (theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: theme.palette.primary.light
  },
  // images slider
  sliderContainer: {
    width: "50%",
    height: "100vh",
    position: "fixed",
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