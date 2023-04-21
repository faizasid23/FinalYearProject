import React, { Component } from "react";
import clonedeep from "lodash.clonedeep";
import {
  Typography,
  ButtonBase,
  Fade,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
  Radio,
  InputAdornment,
  IconButton
} from "@mui/material";
import { withStyles } from "@mui/styles";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// utils
import { withRouter } from '../../utils/router';
import { runValidator } from "../../utils/validations";
// our components
import SuccessModal from "../SuccessModal";
// API calls for forget password etc
import {
  findAccount,
  sendCode,
  verifyCode,
  resetPassword
} from "../../apis/user";

class PasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailHash: "",
      resetMethod: "email",
      code: "",
      password: "",
      password_confirmation: "",
      step: 1, // defining stages for password reset
      errors: {},
      isSubmitLoading: false,
      seconds: 30,
      showPassword: false,
      showConfirmPassword: false,
      showToast: null,
      showClose: false,
    };
    this.timer = null;
    this.INPUTS = {
      email: {
        rules: { required: true, email: true },
        errorMessage: "Provide your email address. ",
      },
      code: {
        rules: { required: true, alphanumeric: true, minLength: 6 },
        errorMessage: "Provide the code. ",
      },
      password: {
        rules: {
          required: true,
          regex: new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"),
        },
        errorMessage: "Provide a password. ",
      },
      password_confirmation: {
        rules: { required: true },
        errorMessage: "Provide a confirmation password. ",
      },
    };
  }

  reduceSecond = () => {
    if (this.state.seconds === 0) {
      clearInterval(this.timer);
      return;
    }
    this.setState({ seconds: this.state.seconds - 1 });
  };

  handleInputChange = (e) => {
    this.clearErrorIfExists(e.target.name);
    this.setState({ [e.target.name]: e.target.value });
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

  validateAll = () => {
    let errors = {};

    let testFields = [];
    if (this.state.step === 1) testFields = ["email"];
    else if (this.state.step === 3) testFields = ["code"];
    else if (this.state.step === 4)
      testFields = ["password", "password_confirmation"];

    for (let field of testFields) {
      let fieldErrors = runValidator(this.state[field], this.INPUTS[field]);
      if (fieldErrors.length > 0) errors[field] = fieldErrors;
    }
    return errors;
  };

  clearErrorIfExists = (name) => {
    if (this.state.errors[name]) {
      let uppdatedErrors = clonedeep(this.state.errors);
      delete uppdatedErrors[name];
      this.setState({ errors: uppdatedErrors });
    }
  };

  handleSendCode = () => {
    // api call
    sendCode({ email: this.state.email, type: this.props.role }).then((result) => {
      if (result.status === "success") {
        // if success
        this.setState({ seconds: 30 });
        setInterval(this.reduceSecond, 1000);
      } else {
        this.setState({
          showToast: {
            status: "error",
            message: result.message ?? "Some error has occured"
          }
        });
      }
    }).catch((error) => {
      this.setState({
        showToast: {
          status: "error",
          message: error.message ?? "Some error has occured"
        },
      });
    });
  };

  handleNext = () => {
    let errors = this.validateAll();

    if (Object.keys(errors).length !== 0) this.setState({ errors });

    else {
      this.setState({ isSubmitLoading: true });

      if (this.state.step === 1) {
        findAccount({ email: this.state.email, type: this.props.role }).then((result) => {
          if (result?.status === "success") {
            this.setState({
              step: this.state.step + 1,
              emailHash: result.data.email,
              isSubmitLoading: false
            });
          } else {
            this.setState({
              isSubmitLoading: false,
              errors: result.errors ?? {}
            });
          }
        }).catch((error) => {
          this.setState({
            isSubmitLoading: false,
            errors: error.errors ?? {},
            showToast: {
              status: "error",
              message: error.message ?? "Some error has occured",
            },
          });
        });
      } else if (this.state.step === 2) {
        // start the interval of the step 3 while the code is getting received
        this.setState(
          { isSubmitLoading: false, step: this.state.step + 1 },
          this.handleSendCode
        );
      } else if (this.state.step === 3) {
        // api call verifyCode
        verifyCode({
          code: this.state.code,
          email: this.state.email
        }).then((result) => {
          if (result.status === "success") {
            this.setState({
              step: this.state.step + 1,
              isSubmitLoading: false
            });
          } else {
            this.setState({
              isSubmitLoading: false,
              errors: result.errors ?? {},
              showToast: {
                status: "error",
                message: result.message ?? "Some error has occured",
              },
            });
          }
        });
      } else if (this.state.step === 4) {
        if (
          this.state.password_confirmation !== "" &&
          this.state.password !== this.state.password_confirmation
        ) {
          this.setState({
            isSubmitLoading: false,
            errors: { password_confirmation: "Password and confirmation password don't match" }
          });
          return;
        }

        resetPassword({
          email: this.state.email,
          type: this.props.role,
          password: this.state.password
        }).then((result) => {
          if (result.status === "success") {
            this.setState({
              step: this.state.step + 1,
              isSubmitLoading: false,
            });
          } else {
            this.setState({
              isSubmitLoading: false,
              errors: result.errors ?? {},
              showToast: {
                status: "error",
                message: result.message ?? "Some error has occured",
              },
            });
          }
        })
          .catch((error) => {
            this.setState({
              isSubmitLoading: false,
              errors: error.errors ?? {},
              showToast: {
                status: "error",
                message: error.message ?? "Some error has occured",
              },
            });
          });
      } else if (this.state.step === 5) {
        this.props.handleClose();
      }
    }
  };

  render = () => {
    let { classes } = this.props;
    return (
      <Dialog
        open={true}
        onClose={() => this.setState({ showClose: true })}
        classes={{ paper: classes.paper }}
      >
        <DialogTitle class={classes.head}>
          {this.state.step === 1 && (
            <Fade in={this.state.step === 1}>
              <div>
                <Typography class={classes.title}>
                  Find Your Account
                </Typography>
                <Typography class={classes.subText}>
                  Please provide your account email for which you want to reset
                  your password!
                </Typography>
              </div>
            </Fade>
          )}
          {this.state.step === 2 && (
            <Fade in={this.state.step === 2}>
              <div>
                <Typography class={classes.title}>
                  Reset Your Password
                </Typography>
                <Typography class={classes.subText}>
                  How do you want to receive the code to reset your password?
                </Typography>
              </div>
            </Fade>
          )}
          {this.state.step === 3 && (
            <Fade in={this.state.step === 3}>
              <div>
                <Typography class={classes.title}>
                  Enter security code
                </Typography>
                <Typography class={classes.subText}>
                  Please check your email for a message with your code.
                </Typography>
              </div>
            </Fade>
          )}
          {this.state.step === 4 && (
            <Fade in={this.state.step === 4}>
              <div>
                <Typography class={classes.title}>
                  Change Password
                </Typography>
                <Typography class={classes.subText}>
                  Create a new, strong password that you don't use for other
                  websites
                </Typography>
              </div>
            </Fade>
          )}
          {this.state.step === 5 && (
            <Fade in={this.state.step === 5}>
              <div>
                <Typography class={classes.title}>
                  Password Changed Successfully
                </Typography>
                <Typography class={classes.subText}>
                  Your password has been updated successfully.
                </Typography>
              </div>
            </Fade>
          )}
        </DialogTitle>
        <DialogContent style={{ paddingBottom: 0 }}>
          <div className={classes.body}>
            {/* step one */}
            {this.state.step === 1 && (
              <Fade in={this.state.step === 1}>
                <TextField
                  required
                  variant="outlined"
                  label="Email"
                  tabIndex={1}
                  name="email"
                  fullWidth={true}
                  onChange={this.handleInputChange}
                  onBlur={this.handleValidation}
                  onFocus={() => this.clearErrorIfExists("email")}
                  error={this.state.errors.email ? true : false}
                  helperText={this.state.errors.email && this.state.errors.email}
                />
              </Fade>
            )}
            {/* step two */}
            {this.state.step === 2 && (
              <Fade in={this.state.step === 2}>
                <div className={classes.step2Container}>
                  <Radio
                    name="method"
                    value="email"
                    color="primary"
                    style={{ marginRight: "0.625rem" }}
                    checked={this.state.resetMethod === "email"}
                  />
                  <div>
                    <Typography>Send code via email</Typography>
                    <Typography>{this.state.emailHash}</Typography>
                  </div>
                </div>
              </Fade>
            )}
            {this.state.step === 3 && (
              <Fade in={this.state.step === 3}>
                <div className={classes.securityCodeContainer}>
                  <TextField
                    required
                    variant="outlined"
                    label="Code"
                    tabIndex={1}
                    name="code"
                    fullWidth={false}
                    inputProps={{ maxLength: 6 }}
                    onChange={this.handleInputChange}
                    onBlur={this.handleValidation}
                    onFocus={() => this.clearErrorIfExists("code")}
                    error={this.state.errors.code ? true : false}
                    helperText={this.state.errors.code && this.state.errors.code}
                  />
                  <Typography>
                    We sent your code to: {this.state.emailHash}
                  </Typography>
                </div>
              </Fade>
            )}
            {this.state.step === 4 && (
              <Fade in={this.state.step === 4}>
                <div className={classes.changePasswordContainer}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    variant="outlined"
                    label="New Password"
                    tabIndex={1}
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    onBlur={this.handleValidation}
                    onFocus={() => this.clearErrorIfExists("password")}
                    type={this.state.showPassword ? "text" : "password"}
                    error={this.state.errors.password ? true : false}
                    helperText={this.state.errors.password}
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
                  <TextField
                    required
                    fullWidth
                    name="password_confirmation"
                    variant="outlined"
                    label="New Password Cofirmation"
                    tabIndex={2}
                    value={this.state.password_confirmation}
                    onChange={this.handleInputChange}
                    onBlur={this.handleValidation}
                    onFocus={() => this.clearErrorIfExists("password_confirmation")}
                    type={this.state.showConfirmPassword ? "text" : "password"}
                    error={this.state.errors.password_confirmation ? true : false}
                    helperText={this.state.errors.password_confirmation}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" variant="filled" tabIndex={-1}>
                          <IconButton
                            tabIndex={-2}
                            aria-label="toggle password visibility"
                            onClick={() => this.setState({ showConfirmPassword: !this.state.showConfirmPassword })}
                            edge="end"
                          >
                            {this.state.showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </Fade>
            )}
          </div>
          <div className={classes.footer}>
            <div>
              {this.state.step === 3 && (
                <>
                  {this.state.seconds === 0 ? (
                    <Typography
                      className={classes.sendCode}
                      onClick={this.handleSendCode}
                    >
                      Resend Code?
                    </Typography>
                  ) : (
                    <Typography>{this.state.seconds} seconds</Typography>
                  )}
                </>
              )}
            </div>
            <div>
              <ButtonBase
                disableRipple
                class={classes.secondaryButton}
                onClick={() => this.setState({ showClose: true })}
              >
                <Typography style={{ fontWeight: 500 }}>Cancel</Typography>
              </ButtonBase>
              <ButtonBase
                disableRipple
                class={classes.primaryButton}
                onClick={this.handleNext}
              >
                {this.state.isSubmitLoading === true ? (
                  <CircularProgress color="inherit" size={16} />
                ) : (
                  <Typography style={{ fontWeight: 500 }}>
                    {this.state.step === 5 ? 'Login' : 'Continue'}
                  </Typography>
                )}
              </ButtonBase>
            </div>
          </div>
          {this.state.showToast !== null && (
            <Snackbar
              open={this.state.showToast !== null}
              autoHideDuration={3000}
              onClose={() => this.setState({ showToast: null })}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <Alert
                variant="standard"
                onClose={() => this.setState({ showToast: null })}
                severity={this.state.showToast.status}
              >
                {this.state.showToast.message}
              </Alert>
            </Snackbar>
          )}
          {this.state.showClose && (
            <SuccessModal
              heading="Confirmation"
              message="Are you sure you want to exit?"
              buttonText="Yes"
              handleSubmit={() => this.props.handleClose()}
              handleCancel={() => this.setState({ showClose: false })}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  };
}

const materialStyles = (theme) => ({
  paper: {
    minWidth: 550,
    "& p": { margin: 0 }
  },
  head: {
    borderBottom: "1px solid #DEE2E6",
    padding: "1rem 2rem",
  },
  // Main title
  title: {
    fontSize: "1.5rem",
    fontWeight: 500,
    color: theme.palette.primary.main,
    marginBottom: "0.5rem",
  },
  body: {
    minHeight: "7rem",
    boxSizing: "border-box",
    "& > :first-child": {
      marginTop: "1rem",
    },
    "& .MuiTextField-root > .MuiFormHelperText-root": {
      marginLeft: 2, marginRight: 0
    }
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    marginTop: "1rem"
  },
  sendCode: {
    cursor: "pointer",
    color: theme.palette.primary.main,
  },
  primaryButton: {
    height: "3.125rem",
    width: "10rem",
    textAlign: "center",
    padding: "0 0rem",
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    borderRadius: "0.25rem",
    border: 'none',
    cursor: 'pointer'
  },
  secondaryButton: {
    height: "3.125rem",
    padding: "0 3rem",
    backgroundColor: "#DEE2E6",
    color: "#8C8C8C",
    borderRadius: "0.25rem",
    border: 'none',
    cursor: 'pointer',
    marginRight: "1rem"
  },
  step2Container: {
    display: "flex",
    alignItems: "center",
  },
  securityCodeContainer: {
    "& > :first-child": { marginBottom: "1rem" },
  },
  changePasswordContainer: {
    marginBottom: "1rem",
    "& > *": {
      marginBottom: "1.25rem !important",
    },
  },
});

export default withRouter(withStyles(materialStyles)(PasswordReset));