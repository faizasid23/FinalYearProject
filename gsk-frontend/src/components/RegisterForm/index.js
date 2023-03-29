// importing react stuff...
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
// importing 3rd party libraries
import clonedeep from "lodash.clonedeep";
import moment from "moment";
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
import { Autocomplete } from "@mui/material/";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// importing our APIs, utilities and configurations
import { getAutocompleteValue } from "../../utils/common";
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
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: this.getRole(),
      showPassword: false,
      showConfirmPassword: false,
      sources: [],
      source_id: null,
      // if the role is manager
      phone: "",
      // if the role is student
      country_id: null,
      coupon_code: "",
      countries: [],
      errors: {},
      submitMessage: false,
      isSubmitLoading: false,
      googleProblem: false,
      isFullScreenLoading: false
    };

    this.INPUTS = {
      first_name: {
        rules: { required: true, name: true, maxLength: 20 },
        errorMessage: "Provide your first name. "
      },
      last_name: {
        rules: { required: true, name: true, maxLength: 20 },
        errorMessage: "Provide your last name. "
      },
      email: {
        rules: { required: true, email: true, maxLength: 254 },
        errorMessage: "Provide your active email address. "
      },
      password: {
        rules: {
          required: true,
          regex: new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})")
        },
        errorMessage: "Provide a password. "
      },
      password_confirmation: {
        rules: { required: true },
        errorMessage: "Provide a confirmation password. "
      },
      country_id: {
        rules: { required: true },
        errorMessage: "Select a country. "
      },
      coupon_code: {
        rules: { required: false, alphanumeric: true, minLength: 5 },
        errorMessage: "Provide a valid code. "
      },
      phone: {
        rules: { required: true },
        errorMessage: "Provide a phone number. "
      },
      source_id: {
        rules: { required: true },
        errorMessage: "Provide a source. "
      }
    };
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
    // getCountriesForPopulates().then((result) => {
    //   if (result) this.setState({ countries: result.filter((item) => item.name === "Pakistan") ?? [] });
    // });
    // getSourcesForPopulates().then((result) => this.setState({ sources: result ?? [] }));

    // if (this.state.role === "student") delete this.INPUTS.phone;
    // else {
    //   delete this.INPUTS.country_id;
    //   delete this.INPUTS.coupon_code;
    // }
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

    if (role === "student") {
      delete this.INPUTS.phone;
      this.INPUTS.country_id = {
        rules: { required: true },
        errorMessage: "Select a country. "
      };
      this.INPUTS.coupon_code = {
        rules: { required: false, alphanumeric: true, minLength: 5 },
        errorMessage: "Provide a valid code. "
      };
    } else {
      delete this.INPUTS.country_id;
      delete this.INPUTS.coupon_code;
      this.INPUTS.phone = {
        rules: { required: true },
        errorMessage: "Provide a phone number. "
      };
    }

    this.props.router.history(`${window.location.pathname}?${queryString.stringify(queryParams)}`);
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
      return
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
  handleInputToogle = (e) => {
    this.clearErrorIfExists(e.target.name);
    this.setState({ [e.target.name]: !this.state[e.target.name] });
  };
  handleSelectChange = (propertyName, value) => {
    this.clearErrorIfExists(propertyName);

    this.setState({
      [propertyName]: value ? value.id : "",
      [propertyName.slice(0, -3)]: value ? value : null,
    });
  };

  handleSubmit = () => {
    let errors = this.validateAll();
    if (Object.keys(errors).length !== 0) {

      const input = document.querySelector(`input[name=${Object.keys(errors)[0]}]`);
      input.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
      this.setState({ errors: errors });
    } else {
      // check password and confirm password
      if (this.state.password !== this.state.password_confirmation) {
        this.setState({ errors: { password_confirmation: "Passwords don't match" } });
        return;
      }
      let {
        first_name,
        last_name,
        email,
        password,
        password_confirmation,
        country_id,
        coupon_code,
        phone,
        source_id,
        role
      } = this.state;

      let timezone = moment.tz?.guess();

      this.setState({ isSubmitLoading: true, submitMessage: false });
      // api call and show status
      let apiCall = role === "student" ? registerStudent : registerManager;
      let newUser = role === "student" ?
        {
          first_name,
          last_name,
          email,
          password,
          password_confirmation,
          timezone,
          country_id,
          coupon_code,
          source_id,
        } : {
          first_name,
          last_name,
          email,
          password,
          password_confirmation,
          timezone,
          phone,
          source_id,
        };
      apiCall(newUser).then((result) => {
        if (result.status === "success")
          this.setState(
            {
              isSubmitLoading: false,
              submitMessage: {
                status: result.status,
                message: result.message,
              },
            },
            () => {
              this.performLogin(result);
            }
          );
        else {
          this.setState({
            isSubmitLoading: false,
            errors: result.errors ? result.errors : {},
            submitMessage: {
              status: result.status,
              message: result.message,
            },
          });
        }
      }).catch((error) => {
        this.setState({ showToast: { status: "error", message: error } });
      });
    }
  };

  performLogin = (result) => {
    // add item to localhost
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(result.data.user));
    localStorage.setItem("user_verif", result.data.accessToken);
    localStorage.setItem("user_role", this.state.role);
    localStorage.setItem("skip_2fa", false);
    // // update token
    updateAuthorizationToken(result.data.accessToken);
    // if(this.state.role==='student')
    // this.props.setstudentInfo(result.data.student_info) // wallet info etc
    // if(this.state.role==='manager')
    //   this.props.setmanagerInfo(result.data.card_details) // wallet info etc
    // // dispatch
    this.props.setUser({
      ...result.data,
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
  };

  render() {
    let { classes } = this.props;

    return (
      <RegisterContainer
        role={this.state.role}
        handleRoleSwitch={this.handleRoleSwitch}
        text={this.state.role === "manager" ? "Sign Up To Hire students" : "Sign Up To Work"}
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
            label="Email"
            name="email"
            tabIndex={3}
            onChange={this.handleInputChange}
            onBlur={this.handleValidation}
            onFocus={this.clearError}
            inputProps={{ maxLength: 254, className: classes.input }}
            error={this.state.errors.email ? true : false}
            helperText={this.state.errors.email && this.state.errors.email}
            FormHelperTextProps={{ className: classes.helperText }}
          />
          <div className={classes.fieldsRow}>
            {/* <PasswordWithStrength
              required
              name="password"
              variant="outlined"
              label="Password"
              tabIndex={4}
              value={this.state.password}
              fullWidth={true}
              onChange={this.handleInputChange}
              onBlur={this.handlePasswordsValidation}
              onFocus={this.clearError}
              error={this.state.errors.password ? true : false}
              helperText={this.state.errors.password && this.state.errors.password}
            /> */}
            <TextField
              required
              variant="outlined"
              label="Confirm Password"
              name="password_confirmation"
              tabIndex={5}
              type={this.state.showConfirmPassword ? "text" : "password"}
              fullWidth={true}
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
                      {this.state.showConfirmPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>
          {this.state.role === "student" && (
            <div className={classes.fieldsRow}>
              <Autocomplete
                classes={{
                  root: classes.autocompleteRoot,
                  inputRoot: classes.selectRoot
                }}
                disableClearable={true}
                fullWidth={true}
                options={this.state.countries}
                getOptionLabel={(option) => option.name ?? ""}
                onChange={(e, val) => this.handleSelectChange("country_id", val)}
                value={getAutocompleteValue(
                  this.state.countries,
                  this.state.country_id
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Country"
                    type="text"
                    name="country_id"
                    placeholder="Select a Country"
                    variant="outlined"
                    tabIndex={5}
                    className={classes.customPlaceholder}
                    onBlur={this.handleValidation}
                    error={this.state.errors.country_id ? true : false}
                    helperText={this.state.errors.country_id}
                    FormHelperTextProps={{ className: classes.helperText }}
                  />
                )}
              />
              <TextField
                fullWidth
                placeholder="PROMOTION CODE"
                name="coupon_code"
                value={this.state.coupon_code}
                variant="outlined"
                onChange={this.handleInputChange}
                error={this.state.errors.coupon_code ? true : false}
                helperText={this.state.errors.coupon_code}
                inputProps={{ maxLength: 10 }}
              />
            </div>
          )}
          {/* {this.state.role === "manager" && (
            <PhoneInput
              country={"us"}
              value={this.state.phone}
              name="phone"
              onBlur={this.handleValidation}
              onChange={(phone, data, event, formattedValue) => {
                this.clearErrorIfExists("phone");
                this.setState({ phone });
              }}
              placeholder="Mobile number"
              hasError={this.state.errors.phone ? true : false}
              errorMessage={this.state.errors.phone}
            />
          )} */}
          <Autocomplete
            classes={{
              root: classes.autocompleteRoot,
              inputRoot: classes.selectRoot
            }}
            disableClearable={true}
            fullWidth={true}
            options={this.state.sources}
            getOptionLabel={(option) => option.name ?? ""}
            onChange={(e, val) => this.handleSelectChange("source_id", val)}
            value={getAutocompleteValue(
              this.state.sources,
              this.state.source_id
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="How did you find us?"
                type="text"
                name="source_id"
                placeholder="Select a source"
                variant="outlined"
                tabIndex={5}
                className={classes.customPlaceholder}
                onBlur={this.handleValidation}
                error={this.state.errors.source_id ? true : false}
                helperText={this.state.errors.source_id}
                FormHelperTextProps={{ className: classes.helperText }}
              />
            )}
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
          className={classes.submitButton}
          onClick={this.state.isSubmitLoading ? () => 1 : this.handleSubmit}
          disabled={this.state.isSubmitLoading}
        >
          {this.state.isSubmitLoading ? (
            <CircularProgress
              style={{ color: "#fff", height: "2.5rem", width: "2.5rem" }}
            />
          ) : (
            <Typography>Register</Typography>
          )}
        </ButtonBase>
        {/* 
        {this.state.googleProblem === false && (
          <>
            <div className={classes.dividerContainer}>
              <div className={classes.horizontalDivider}>&nbsp;</div>
              <Typography className={classes.dividerContainerText}>Or continue with</Typography>
              <div className={classes.horizontalDivider}>&nbsp;</div>
            </div>
            <div className={classes.socialIcons}>
              <ButtonBase>
                <img src={FacebookIcon} style={{ width: '.8rem' }} alt="" srcset="" />
              </ButtonBase>
              <GoogleLogin
                clientId="99900795968-vfq3c40lkaf7mc8fjpc69veqdttng507.apps.googleusercontent.com"
                render={(renderProps) => (
                  <ButtonBase onClick={renderProps.onClick} disabled={renderProps.disabled}>
                    <img src={GoogleIcon} alt="" srcset="" />
                  </ButtonBase>
                )}
                onSuccess={this.handleGoogleOAuth}
                onFailure={this.handleGoogleOAuth}
                cookiePolicy={'single_host_origin'}
              />
              <ButtonBase>
                <img src={LinkedinIcon} alt="" srcset="" />
              </ButtonBase>
            </div>
          </>
        )} 
      */}

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
      marginBottom: "2.375rem"
    }
  },
  logo: {
    width: "12.5rem",
    marginBottom: "3.25rem",
    cursor: "pointer",
    [theme.breakpoints.down(1400)]: {
      marginBottom: "1.25rem"
    }
  },
  textsContainer: {
    marginBottom: "2.25rem",
  },
  loginTitle: {
    fontSize: "3.125rem",
    fontWeight: 500,
    marginBottom: "1rem",
  },
  // dividerContainer: {
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: "2.625rem",
  //   marginBottom: "1.25rem",
  // },
  // horizontalDivider: {
  //   height: 1,
  //   width: "4.5rem",
  //   borderBottom: "1px solid #8C8C8C",
  // },
  // dividerContainerText: {
  //   marginRight: "0.75rem",
  //   marginLeft: "0.75rem",
  // },
  // social icons
  // socialIcons: {
  //   display: "flex",
  //   justifyContent: "center",
  //   "& > *": {
  //     height: "3.125rem",
  //     width: "3.125rem",
  //     display: "flex",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     border: "1px solid #DEE2E6",
  //     borderRadius: "0.3125rem",
  //     boxShadow: "3px 4px 4px rgba(150, 168, 219, 0.16)",
  //     marginRight: "1.5rem",
  //     "& img": {
  //       width: "1.3rem",
  //     },
  //   },
  //   "& > *:last-child": {
  //     marginRight: 0,
  //   },
  // },
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
      marginLeft: "1.1875rem",
    },
    "& .MuiTextField-root > .MuiFormHelperText-root": {
      marginLeft: 2, marginRight: 0
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      marginBottom: 0,
      "& > div": {
        marginBottom: "2.375rem",
        marginLeft: "0 !important",
        marginRight: "0 !important",
      },
    },
  },
  submitButton: {
    display: "flex",
    backgroundColor: theme.palette.primary.main,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "3.75rem",
    borderRadius: "0.3125rem",
    "& > p": {
      color: "#fff",
    },
  },
  // misc
  linkText: {
    fontWeight: 500,
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
  helperText: { marginLeft: 2, marginRight: 0 }
});

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user))
  };
};

export default connect(null, mapDispatchToProps)(withRouter(withStyles(materialStyles)(RegisterForm)));
