// importing react stuff...
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
// importing 3rd party libraries
import clonedeep from "lodash.clonedeep";
import {
  Typography,
  TextField,
  ButtonBase,
  InputAdornment,
  IconButton,
  CircularProgress
} from "@mui/material";
import { withStyles } from "@mui/styles";
import Alert from "@mui/material/Alert";
import queryString from "query-string";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// importing our APIs, utilities and configurations
import { runValidator } from "../../utils/validations";
import { withRouter } from '../../utils/router';
import {
  loginStudent,
  loginManager
} from "../../apis/user";
import { updateAuthorizationToken } from "../../apis/axiosConfig";
import { setUser } from "../../redux/ActionCreators";
import FullscreenLoader from "../FullscreenLoader";
// Wrapping our login screen in this component
import LoginContainer from "../AuthScreen/";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isRemember: true,
      showPassword: false,
      resend_time: 0,
      resend_time_limit: 0,
      isCodeSending: false,
      isCodeVerifying: false,
      codeVerifyModal: false,
      errors: {},
      submitMessage: false,
      isSubmitLoading: false,
      role: this.getRole(),
      isFullScreenLoading: false,
      googleProblem: false,
      showPasswordReset: false
    };
    this.timer = null;
    this.INPUTS = {
      email: {
        rules: { required: true, email: true, maxLength: 254 },
        errorMessage: "Provide an email address",
      },
      password: {
        rules: { required: true },
        errorMessage: "Provide a password"
      }
    };
  }

  componentDidMount = () => {
    // getAppSettings().then((result) => {
    //   result.forEach((item) => {
    //     if (item.key === "resend_time")
    //       this.setState({ resend_time_limit: parseInt(item.value) ?? 30 })
    //   });
    // })
  }

  getRole = () => {
    let queryParams = queryString.parse(this.props.location.search);
    let role = queryParams.role !== undefined ? queryParams.role : "";
    switch (role.toLowerCase()) {
      case "manager":
        return "manager";
      case "admin":
        return "admin";
      default:
        return "student";
    }
  };

  // VALIDATIONS PART
  handleValidation = (e) => {
    let errors = runValidator(e.target.value, this.INPUTS[e.target.name]);

    if (errors.length > 0) {
      let uppdatedErrors = clonedeep(this.state.errors);
      this.setState({
        errors: { ...uppdatedErrors, [e.target.name]: errors },
      });
    } else {
      let uppdatedErrors = clonedeep(this.state.errors);
      delete uppdatedErrors[e.target.name];
      this.setState({ errors: uppdatedErrors });
    }
  };

  validateAll = () => {
    let errors = {};
    for (let field in this.INPUTS) {
      let fieldErrors = runValidator(this.state[field], this.INPUTS[field]);
      if (fieldErrors.length > 0) errors[field] = fieldErrors;
    }
    return errors;
  };

  clearError = (e) => {
    if (this.state.errors[e.target.name]) {
      let uppdatedErrors = clonedeep(this.state.errors);
      delete uppdatedErrors[e.target.name];
      this.setState({ errors: uppdatedErrors });
    }
  };

  clearSubmitMessage = () => {
    let newState = clonedeep(this.state);
    delete newState.submitMessage;
    this.setState({ submitMessage: newState.submitMessage });
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleInputToogle = (checkbox) => {
    this.setState({ [checkbox]: !this.state[checkbox] });
  };

  handleRoleSwitch = () => {
    let role = this.state.role === "student" ? "manager" : "student";
    // update query params
    let queryParams = queryString.parse(this.props.location.search);
    queryParams.role = role;
    this.props.history(`${window.location.pathname}?${queryString.stringify(queryParams)}`);
    this.setState({ role });
  };

  handleLoginClick = () => {
    let errors = this.validateAll();
    if (Object.keys(errors).length !== 0) {
      this.setState({ errors: errors });
    } else {
      this.setState({ isSubmitLoading: true, submitMessage: false });
      // api call and show status
      let callback = null;
      // assign function for login
      switch (this.state.role) {
        case "manager":
          callback = loginManager;
          break;
        default:
          callback = loginStudent;
          break;
      }

      callback({ email: this.state.email, password: this.state.password }).then((result) => {
        if (result.status === "success") {
          // if (result?.data?.user?.is_2fa_enabled === 1) this.handle2fa()
          // else {
          this.setState({ isSubmitLoading: false }, () => this.performLogin(result))
          // }
        } else {
          this.setState({
            isSubmitLoading: false,
            errors: result.errors ?? {},
            submitMessage: {
              status: result.status,
              message: result.message
            }
          });
        }
      });
    }
  };

  reduceSecond = () => {
    let resend_time = this.state.resend_time - 1

    this.setState({ resend_time: resend_time })

    if (resend_time === 0) clearInterval(this.timer);
  };

  handleCodeModalClose = () => {
    clearInterval(this.timer)
    this.setState({
      errors: {},
      resend_time: 0,
      codeVerifyModal: false
    })
  }

  handleVerifyCode = (code) => {
    this.setState({ isCodeVerifying: true })

    let params = {
      email: this.state.email,
      password: this.state.password,
      code
    }

    let callback;
    switch (this.state.role) {
      case "manager":
        callback = loginManager;
        break;
      default:
        callback = loginStudent;
        break;
    }

    callback(params).then((result) => {
      if (result.status === "success") {
        this.setState({
          codeVerifyModal: false,
          isCodeVerifying: false,
        }, () => this.performLogin(result));
      } else {
        this.setState({
          isCodeVerifying: false,
          errors: result.errors ?? {}
        });
      }
    }).catch((err) => {
      this.setState({
        codeVerifyModal: false,
        isCodeVerifying: false,
        submitMessage: {
          status: "error",
          message: err.message ?? "Some error has occured, please try again later."
        }
      });
    });
  }

  performLogin = (result) => {
    // add item to localhost
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(result.data.user));
    localStorage.setItem("user_verif", result.data.token);
    localStorage.setItem("user_role", this.state.role);
    localStorage.setItem("skip_2fa", false);
    // // update token
    updateAuthorizationToken(result.data.token);
    if (this.state.role === "student")
      this.props.setstudentInfo(result.data.student_info); // wallet info etc
    if (this.state.role === "manager")
      this.props.setmanagerInfo(result.data.card_details); // wallet info etc
    // // dispatch
    this.props.setUser({
      ...result.data,
      subRole: result.data.staff_role,
      role: this.state.role,
      isVerified: true,
      isVerifying: false,
    });

    // redirect
    this.props.history(`/${this.state.role}/dashboard`);
  };

  handleLink = (e, link) => {
    e.preventDefault();
    this.props.history(link);
  }

  render() {
    let { classes } = this.props;

    return (
      <LoginContainer
        role={this.state.role}
        handleRoleSwitch={this.handleRoleSwitch}
        text="Login"
      >
        <Helmet>
          <title>Login | GSK</title>
        </Helmet>
        {/* Login form */}

        {/* Form fields start */}
        <div className={classes.fieldsContainer}>
          <TextField
            required
            variant="outlined"
            label="Email"
            tabIndex={1}
            name="email"
            onChange={this.handleInputChange}
            onBlur={this.handleValidation}
            onFocus={this.clearError}
            error={this.state.errors.email ? true : false}
            helperText={this.state.errors.email && this.state.errors.email}
            inputProps={{ maxLength: 254, class: classes.input }}
          />
          <TextField
            required
            variant="outlined"
            label="Password"
            tabIndex={2}
            name="password"
            type={this.state.showPassword ? "text" : "password"}
            onChange={this.handleInputChange}
            onBlur={this.handleValidation}
            onFocus={this.clearError}
            error={this.state.errors.password ? true : false}
            helperText={this.state.errors.password && this.state.errors.password}
            inputProps={{ class: classes.input }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" variant="filled" tabIndex={-1}>
                  <IconButton
                    tabIndex={-2}
                    aria-label="toggle password visibility"
                    onClick={() => this.setState({ showPassword: !this.state.showPassword })}
                    edge="end"
                  >
                    {this.state.showPassword ? <VisibilityIcon />
                      : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {this.state.submitMessage && (
            <Alert
              className={classes.submitMessage}
              variant="standard"
              severity={this.state.submitMessage.status}
              onClose={this.clearSubmitMessage}
            >
              {this.state.submitMessage.message}
            </Alert>
          )}
        </div>
        {/* Form Fields End */}

        {/* Login button */}
        <ButtonBase
          type="submit"
          tabIndex={3}
          class={classes.submitButton}
          onClick={this.state.isSubmitLoading ? () => 1 : this.handleLoginClick}
          disabled={this.state.isSubmitLoading}
        >
          {this.state.isSubmitLoading ? (
            <CircularProgress
              style={{ color: "#fff", height: "2.5rem", width: "2.5rem" }}
            />
          ) : (
            <Typography>LOGIN</Typography>
          )}
        </ButtonBase>

        {this.state.role !== "admin" && this.state.googleProblem === false && (
          <div className={classes.alreadyAccountContainer}>
            <Typography>
              Don't have an account?
              <Link
                className={classes.linkText}
                to={`/register?role=${this.state.role}`}
              >
                &nbsp; Register
              </Link>
            </Typography>
          </div>
        )}
        {/* Images slider */}
        {this.state.isFullScreenLoading === true && <FullscreenLoader />}
      </LoginContainer>
    );
  }
}

const materialStyles = (theme) => ({
  input: {
    WebkitBoxShadow: "0 0 0 1000px white inset"
  },
  fieldsContainer: {
    display: "flex",
    flexDirection: "column",
    "& > *": {
      marginBottom: "2.375rem !important",
    },
    "& .MuiTextField-root > .MuiFormHelperText-root": {
      marginLeft: 2, marginRight: 0
    }
  },
  submitMessage: {
    "& .MuiAlert-icon": {
      marginRight: "1rem",
      alignItems: 'center',
    },
    "& .MuiAlert-message": {
      alignSelf: 'center',
      lineHeight: '1.5rem',
      padding: '0.5rem 0rem'
    }
  },
  alreadyAccountContainer: {
    marginTop: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    display: "flex",
    backgroundColor: theme.palette.primary.main,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "3.75rem",
    borderRadius: "0.325rem",
    border:'none',
    "& > p": { color: "#fff" }
  },
  linkText: {
    fontWeight: 500,
    textDecoration: "none",
    color: theme.palette.primary.main
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user))
  };
};

export default connect(null, mapDispatchToProps)(withRouter(withStyles(materialStyles)((LoginForm))));