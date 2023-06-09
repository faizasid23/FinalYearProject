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
  CircularProgress,
  Checkbox
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
// Wrapping our login screen in this component
import LoginContainer from "../AuthScreen";
import PasswordResetModal from "../PasswordResetModal";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // states for login form
      email: "",
      password: "",
      showPassword: false,
      role: this.getRole(),
      errors: {},
      submitMessage: false,
      isSubmitLoading: false,
      showPasswordReset: false
    };
    this.INPUTS = {
      email: {
        rules: { required: true, email: true, maxLength: 254 },
        errorMessage: "Provide your GSK email address. ",
      },
      password: {
        rules: { required: true },
        errorMessage: "Provide a password. "
      }
    };
  }

  getRole = () => {
    let queryParams = queryString.parse(this.props.location.search);
    let role = queryParams.role !== undefined ? queryParams.role : "";
    switch (role.toLowerCase()) {
      case "manager":
        return "manager";
      case "student":
        return "student";
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

    // if there are errors set state and show errors
    if (Object.keys(errors).length !== 0) this.setState({ errors: errors });
    // else hit the api
    else {
      this.setState({ isSubmitLoading: true, submitMessage: false });

      // destructure the state to get textfield values for sending to the server
      let { email, password, role } = this.state;

      // api call depending on who is logging in 
      let apiCall = role === "student" ? loginStudent : loginManager;

      apiCall({ email, password }).then((result) => {
        if (result.status === "success") {
          // if result is successful perform the login action
          this.setState({ isSubmitLoading: false }, () => this.performLogin(result))
        } else {
          // otherwise show the error states
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

  performLogin = (result) => {
    // Add the user & token to browsers localStorage
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(result.data.data.user));
    localStorage.setItem("user_verif", result.data.token);
    localStorage.setItem("user_role", this.state.role);
    // update the auth token in the header (for requests)
    updateAuthorizationToken(result.data.token);
    // also dispatch and store the user details in the redux store
    this.props.setUser({
      ...result.data.data,
      role: this.state.role,
      isVerified: true,
      isVerifying: false
    });

    // redirect to the dashboard of the user
    this.props.history(`/${this.state.role}/dashboard`);
  };

  render() {
    let { classes } = this.props;

    return (
      <LoginContainer
        role={this.state.role}
        handleRoleSwitch={this.handleRoleSwitch}
        text="Log In"
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
            label="GSK Email"
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
                    {this.state.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div className={classes.formFooter}>
            <div className={classes.rememberMe}>
              <Checkbox
                name="isRemember"
                checked={this.state.isRemember}
              />
              <Typography>Keep me logged in </Typography>
            </div>
            <Typography
              className={classes.forgotPasswordText}
              onClick={() => this.setState({ showPasswordReset: true })}
            >
              Forgot Password?
            </Typography>
          </div>

          {/* Alert / Toast messages from API hitting */}
          {this.state.submitMessage && (
            <Alert
              variant="standard"
              severity={this.state.submitMessage.status}
              onClose={this.clearSubmitMessage}
            >
              {this.state.submitMessage.message}
            </Alert>
          )}
          {/* Login button */}
          {this.state.isSubmitLoading ? (
            <CircularProgress
              style={{ color: "#F36633", height: "2.5rem", width: "2.5rem", alignSelf: 'center' }}
            />
          ) : (
            <ButtonBase
              type="submit"
              tabIndex={7}
              class={classes.submitButton}
              onClick={this.handleLoginClick}
            >
              <Typography>LOGIN</Typography>
            </ButtonBase>
          )}
        </div>
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
        {this.state.showPasswordReset && (
          <PasswordResetModal
            role={this.state.role}
            handleClose={() => this.setState({ showPasswordReset: false })}
          />
        )}
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
      marginBottom: "1.375rem !important",
    },
    "& .MuiTextField-root > .MuiFormHelperText-root": {
      marginLeft: 2, marginRight: 0
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
    border: 'none',
    cursor: 'pointer',
    "& > p": { color: "#fff" }
  },
  linkText: {
    fontWeight: 500,
    textDecoration: "none",
    color: theme.palette.primary.main
  },
  formFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: 'center'
  },
  rememberMe: {
    display: "flex",
    alignItems: 'center'
  },
  forgotPasswordText: {
    fontSize: "0.875rem",
    color: theme.palette.primary.main,
    cursor: "pointer",
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user))
  };
};

export default connect(null, mapDispatchToProps)(withRouter(withStyles(materialStyles)((LoginForm))));