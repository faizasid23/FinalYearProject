// importing react stuff...
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
// importing 3rd party libraries
import clonedeep from "lodash.clonedeep";
import queryString from "query-string";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// importing our APIs, utilities and configurations
import { runValidator } from "../../utils/validations";
import { withRouter } from "../../utils/router";
import {
  registerStudent,
  registerManager
} from "../../apis/user";
import { updateAuthorizationToken } from "../../apis/axiosConfig";
import { setUser } from "../../redux/ActionCreators";
// Wrapping our Register screen in this component
import RegisterContainer from "../AuthScreen/";

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // states for the textfields which are then sent to the backend
      first_name: "",
      last_name: "",
      mudid: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: this.getRole(),
      showPassword: false,
      showConfirmPassword: false,
      // validation errors are stored in this state
      errors: {},
      // states for the toast message and loader while API requests are made
      submitMessage: false,
      isSubmitLoading: false
    };
    // this is configuration state for the validation which we will feed to the validator 
    this.INPUTS = {
      first_name: {
        rules: { required: true, name: true, maxLength: 20 },
        errorMessage: "Provide your first name. "
      },
      last_name: {
        rules: { required: true, name: true, maxLength: 20 },
        errorMessage: "Provide your last name. "
      },
      mudid: {
        rules: { required: true, maxLength: 20 },
        errorMessage: "Provide your MUDID. "
      },
      email: {
        rules: { required: true, email: true, maxLength: 254 },
        errorMessage: "Provide your GSK email address. "
      },
      password: {
        rules: { required: true },
        errorMessage: "Provide a password. "
      },
      password_confirmation: {
        rules: { required: true },
        errorMessage: "Provide a confirmation password. "
      }
    };
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  clearErrorIfExists = (name) => {
    if (this.state.errors[name]) {
      let uppdatedErrors = clonedeep(this.state.errors);
      delete uppdatedErrors[name];
      this.setState({ errors: uppdatedErrors });
    }
  };

  handleRoleSwitch = () => {
    let role = this.state.role === "student" ? "manager" : "student";
    // update query params
    let queryParams = queryString.parse(this.props.location.search);
    queryParams.role = role;

    this.props?.history(`${window.location.pathname}?${queryString.stringify(queryParams)}`);
    this.setState({ role });
  };

  getRole = () => {
    let queryParams = queryString.parse(this.props.location.search);
    let role = queryParams.role !== undefined ? queryParams.role : "";
    switch (role.toLowerCase()) {
      case "manager":
        return "manager";
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
        errors: { ...uppdatedErrors, [e.target.name]: errors }
      });
    } else {
      let uppdatedErrors = clonedeep(this.state.errors);
      delete uppdatedErrors[e.target.name];
      this.setState({ errors: uppdatedErrors });
    }
  };

  handlePasswordsValidation = (e) => {
    this.handleValidation(e);
    if (this.state.password !== "" && this.state.password_confirmation !== "" && this.state.password !== this.state.password_confirmation) {
      this.setState({
        errors: {
          ...this.state.errors,
          password_confirmation: "Passwords don't match"
        }
      });
      return;
    }
  };

  validateAll = () => {
    let errors = {};
    for (let field in this.INPUTS) {
      let fieldErrors = runValidator(this.state[field], this.INPUTS[field]);
      if (fieldErrors.length > 0) errors[field] = fieldErrors
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
    this.clearErrorIfExists(e.target.name);
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    let errors = this.validateAll();

    // if there are errors set state and show errors
    if (Object.keys(errors).length !== 0) this.setState({ errors: errors });
    // else hit the api
    else {
      // Check password and confirm password if they match
      if (this.state.password !== this.state.password_confirmation) {
        this.setState({ errors: { password_confirmation: "Passwords don't match" } });
        return;
      }
      // destructure the state to get textfield values for sending to the server
      let { first_name, last_name, email, mudid, password, password_confirmation, role } = this.state;

      this.setState({ isSubmitLoading: true, submitMessage: false });
      // api call depending on who is registering
      let apiCall = role === "student" ? registerStudent : registerManager;
      let params = {
        first_name,
        last_name,
        email,
        mudid,
        password,
        password_confirmation
      };

      apiCall(params).then((result) => {
        if (result.status === "success")
          // if API call was successful set state and perform login then
          this.setState(
            {
              isSubmitLoading: false,
              submitMessage: { status: result.status, message: result.message, },
            }, () => { this.performLogin(result); }
          );
        else {
          // otherwise set error state and show what happened via toast message
          this.setState({
            isSubmitLoading: false,
            errors: result.errors ?? {},
            submitMessage: {
              status: "error",
              message: result.message
            }
          });
        }
      }).catch((error) => {
        this.setState({ submitMessage: { status: "error", message: error } });
      });
    }
  };

  performLogin = (result) => {
    // Add the user & token to browsers localStorage
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(result.data.user));
    localStorage.setItem("user_verif", result.data.accessToken);
    localStorage.setItem("user_role", this.state.role);
    // update the auth token in the header (for requests)
    updateAuthorizationToken(result.data.accessToken);
    // also dispatch and store the user details in the redux store
    this.props.setUser({
      ...result.data,
      role: this.state.role,
      isVerified: true,
      isVerifying: false
    });
    // redirect to the dashboard of the user
    this.props?.history(`/${this.state.role}/dashboard`);
  };

  render() {
    let { classes } = this.props;

    return (
      <RegisterContainer
        role={this.state.role}
        handleRoleSwitch={this.handleRoleSwitch}
        text={this.state.role === "manager" ? "Sign Up To Interact With Students" : "Sign Up To Work"}
      >
        <Helmet>
          <title>
            Register | GSK
          </title>
        </Helmet>
        <div className={classes.fieldsContainer}>
          <div className={classes.fieldsRow}>
            <TextField
              required
              variant="outlined"
              label="First Name"
              name="first_name"
              tabIndex={1}
              type="text"
              onChange={this.handleInputChange}
              onBlur={this.handleValidation}
              inputProps={{ maxLength: 20 }}
              onFocus={this.clearError}
              fullWidth={true}
              error={this.state.errors.first_name ? true : false}
              helperText={this.state.errors.first_name && this.state.errors.first_name}
            />
            <TextField
              required
              variant="outlined"
              label="Last Name"
              name="last_name"
              tabIndex={2}
              type="text"
              fullWidth={true}
              onChange={this.handleInputChange}
              onBlur={this.handleValidation}
              inputProps={{ maxLength: 20 }}
              onFocus={this.clearError}
              error={this.state.errors.last_name ? true : false}
              helperText={this.state.errors.last_name && this.state.errors.last_name}
            />
          </div>
          <TextField
            required
            variant="outlined"
            label="MUDID"
            name="mudid"
            tabIndex={3}
            type="text"
            fullWidth={true}
            onChange={this.handleInputChange}
            onBlur={this.handleValidation}
            inputProps={{ maxLength: 20 }}
            onFocus={this.clearError}
            error={this.state.errors.mudid ? true : false}
            helperText={this.state.errors.mudid && this.state.errors.mudid}
          />
          <TextField
            required
            variant="outlined"
            label="GSK Email"
            name="email"
            tabIndex={4}
            onChange={this.handleInputChange}
            onBlur={this.handleValidation}
            onFocus={this.clearError}
            inputProps={{ maxLength: 254, className: classes.input }}
            error={this.state.errors.email ? true : false}
            helperText={this.state.errors.email && this.state.errors.email}
          />
          <div className={classes.fieldsRow}>
            <TextField
              required
              fullWidth
              variant="outlined"
              name="password"
              label="Password"
              tabIndex={5}
              type={this.state.showPassword ? "text" : "password"}
              onChange={this.handleInputChange}
              onBlur={this.handlePasswordsValidation}
              onFocus={this.clearError}
              error={this.state.errors.password ? true : false}
              helperText={this.state.errors.password && this.state.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" variant="filled" tabIndex={-1}>
                    <IconButton
                      tabIndex={-1}
                      aria-label="toggle password visibility"
                      onClick={() => this.setState({ showPassword: !this.state.showPassword })}
                      edge="end"
                    >
                      {this.state.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              required
              fullWidth
              variant="outlined"
              label="Confirm Password"
              name="password_confirmation"
              tabIndex={6}
              type={this.state.showConfirmPassword ? "text" : "password"}
              onChange={this.handleInputChange}
              onBlur={this.handlePasswordsValidation}
              onFocus={this.clearError}
              error={this.state.errors.password_confirmation ? true : false}
              helperText={
                this.state.errors.password_confirmation &&
                this.state.errors.password_confirmation
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" variant="filled" tabIndex={-1}>
                    <IconButton
                      tabIndex={-1}
                      aria-label="toggle password visibility"
                      onClick={() => this.setState({ showConfirmPassword: !this.state.showConfirmPassword })}
                      edge="end"
                    >
                      {this.state.showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>
          {/* for error triggering */}
          {this.state.submitMessage && (
            <Alert
              variant="standard"
              severity={this.state.submitMessage.status}
              onClose={this.clearSubmitMessage}
            >
              {this.state.submitMessage.message}
            </Alert>
          )}
        </div>
        {/* Form Fields End */}

        {/* if the api call is made show loader otherwise a button */}
        {this.state.isSubmitLoading ? (
          <CircularProgress
            style={{ color: "#fff", height: "2.5rem", width: "2.5rem" }}
          />
        ) : (
          <ButtonBase
            tabIndex={7}
            class={classes.submitButton}
            onClick={this.handleSubmit}
          >
            <Typography>Register</Typography>
          </ButtonBase>
        )}
        <div className={classes.alreadyAccountContainer}>
          <Typography>
            Already have an account?
            <Link
              className={classes.linkText}
              to={`/login?role=${this.state.role}`}
            >
              &nbsp; Login
            </Link>
          </Typography>
        </div>
      </RegisterContainer>
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
      marginBottom: "1.375rem !important"
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
  // fields row
  fieldsRow: {
    display: "flex",
    justifyContent: "space-between",
    "& > *:first-child": {
      marginRight: "1.1875rem",
    },
    "& > *:last-child": {
      marginLeft: "1.1875rem"
    }
  },
  submitButton: {
    display: "flex",
    backgroundColor: theme.palette.primary.main,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "3.75rem",
    borderRadius: "0.3125rem",
    border: 'none',
    cursor: 'pointer',
    "& > p": { color: "#fff" }
  },
  // misc
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

export default connect(null, mapDispatchToProps)(withRouter(withStyles(materialStyles)(RegisterForm)));
