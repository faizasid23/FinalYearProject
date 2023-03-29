import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from '../../utils/router';
// Importing a library material UI for aesthetics
import { Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
// Importing Icons/Images for our UI
import { ReactComponent as StudentAvatar } from "../../assets/images/student.svg";
import { ReactComponent as ManagerAvatar } from "../../assets/images/manager.svg";
// importing reusable components 
import RoundedButton from "../RoundedButton";

const Homepage = (props) => {
  let { classes } = props;

  return (
    <div className={classes.main}>
      <div className={classes.container}>
        <div className={classes.topBackground} />
        <div className={classes.containerInner}>
          <div className={classes.heading}>
            <Typography>Welcome to IP Workday System. Choose your role below</Typography>
          </div>
          <div className={classes.cardsContainer}>
            <div className={classes.cards}>
              <div className={classes.card}>
                <ManagerAvatar height={"9rem"} width={"7rem"} />
                <Typography>I am a manager</Typography>
                <div className={classes.cardButton}>
                  <RoundedButton
                    variant="outlined"
                    fullWidth={true}
                    handleSubmit={() =>
                      props.history("/register?role=manager")
                    }
                  >
                    <span style={{ fontWeight: 500 }}>SIGN UP</span>
                  </RoundedButton>
                </div>
                <Typography class={classes.greyText}>
                  Already have an account?{" "}
                  <Link to="/login?role=manager" className={classes.linkText}>
                    Login
                  </Link>
                </Typography>
              </div>

              <div className={classes.card}>
                <StudentAvatar height={"9rem"} width={"9rem"} />
                <Typography>I am a student</Typography>
                <div className={classes.cardButton}>
                  <RoundedButton
                    variant="outlined"
                    fullWidth={true}
                    handleSubmit={() =>
                      props.history("/register?role=student")
                    }
                  >
                    <span style={{ fontWeight: 500 }}>SIGN UP</span>
                  </RoundedButton>
                </div>
                <Typography class={classes.greyText}>
                  Already have an account?{" "}
                  <Link to="/login?role=student" className={classes.linkText}>
                    Login
                  </Link>
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const materialStyles = (theme) => ({
  main: {
    backgroundColor: "#F5F5F5",
    position: "relative",
  },
  topBackground: {
    backgroundColor: theme.palette.primary.main,
    zIndex: 1,
    height: "50vh",
    width: "100%",
    position: "absolute",
    top: 0
  },
  container: {
    display: "flex",
    minHeight: "100vh",
    justifyContent: "center",
    maxWidth: "53.8rem",
    margin: "0 auto",
    paddingTop: "2rem",
    zIndex: 1,
    "& > *": { zIndex: 2 },
  },
  containerInner: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  // heading
  heading: {
    textAlign: "center",
    marginBottom: "3rem",
    marginTop: "2rem",
    color: "white",
    "& > p": {
      fontSize: '2rem'
    }
  },
  cardsContainer: { zIndex: 10 },
  cards: {
    display: "flex",
    zIndex: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    "& > :first-child": { marginRight: "3rem" }
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "24rem",
    backgroundColor: "#fff",
    boxShadow: "rgba(0, 0, 0, 0.05) 0px 4px 10px 3px",
    borderRadius: "0.625rem",
    padding: "2.5rem",
    marginBottom: "5rem",
    boxSizing: "border-box",
    "& > :first-child": { marginBottom: "1rem" },
    // headline
    "& > :nth-child(2)": {
      fontSize: "1.75rem",
      fontWeight: 500,
      textTransform: "uppercase",
      marginBottom: "1rem",
    },
    // button
    "& > :nth-child(3)": { width: "16rem" }
  },
  cardButton: {
    marginBottom: "0.75rem"
  },
  // misc
  linkText: {
    fontWeight: 500,
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
  greyText: { color: "#8C8C8C" }
});

export default withRouter(withStyles(materialStyles)(Homepage));