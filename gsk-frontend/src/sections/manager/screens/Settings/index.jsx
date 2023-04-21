import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from '../../../../utils/router';
import { Alert, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RoundedButton from '../../../../components/RoundedButton';
import { withStyles } from '@mui/styles';
import { runValidator } from '../../../../utils/validations';
import cloneDeep from 'lodash.clonedeep';
import { resetPassword } from '../../../../apis/user';

export const Index = (props) => {

    let { classes, user } = props;

    const INPUTS = {
        old_password: {
            rules: { required: true },
            errorMessage: "Provide your current password. "
        },
        password: {
            rules: {
                required: true,
                regex: new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})")
            },
            errorMessage: "Provide a new password. "
        },
        password_confirmation: {
            rules: { required: true },
            errorMessage: "Provide a confirmation password. "
        }
    };

    const [state, setState] = useState({
        old_password: "",
        password: "",
        password_confirmation: ""
    })
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setisLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [showToast, setShowToast] = useState(null)

    const validateAll = () => {
        let _errors = cloneDeep(errors);
        for (let field in INPUTS) {
            let fieldErrors = runValidator(state[field], INPUTS[field]);
            if (fieldErrors.length > 0) _errors[field] = fieldErrors;
        }
        return _errors;
    };

    const resetState = () => {
        setState({
            old_password: "",
            password: "",
            password_confirmation: ""
        })
    }

    const handlePasswordReset = () => {
        let errors = validateAll();

        if (Object.keys(errors).length !== 0) setErrors(errors)

        else if (state.password !== state.password_confirmation) {
            setErrors({ password_confirmation: "Password confirmation doesn't match password" })
        } else if (state.password === state.old_password) {
            setErrors({ password: "Your new password cannot be the same as your current password" });
        } else {
            setisLoading(true);

            let data = {
                password: state.password,
                old_password: state.old_password,
                id: user.user?._id,
                type: user.role
            };
            resetPassword(data).then((result) => {
                if (result && result.status === "success") {

                    setisLoading(false)
                    setShowToast({
                        status: "success",
                        message: "Password reset successful"
                    })
                    resetState();
                } else {
                    setisLoading(false)
                    setErrors(result.errors ?? {})
                    setShowToast({
                        status: "error",
                        message: result.message ?? "Some issue occured"
                    });
                }
            }).catch((error) => {
                setisLoading(false)
                setShowToast({ status: "error", message: "Some issue occured" });
            });
        }
    }

    const clearErrorIfExists = (name) => {
        if (errors[name]) {
            let uppdatedErrors = cloneDeep(errors);
            delete uppdatedErrors[name];
            setErrors(uppdatedErrors)
        }
    }

    const handleValidation = (e) => {
        let errors = runValidator(e.target.value, INPUTS[e.target.name]);
        if (errors.length > 0) {
            let uppdatedErrors = cloneDeep(errors);
            setErrors({ ...uppdatedErrors, [e.target.name]: errors });
        } else {
            let uppdatedErrors = cloneDeep(errors);
            delete uppdatedErrors[e.target.name];
            setErrors(uppdatedErrors);
        }
    }

    const handleInputChange = (e) => {
        clearErrorIfExists(e.target.name);
        setState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    return (
        <div className={classes.page}>
            <Grid container spacing={3} className={classes.container}>
                <Grid item md={12}>
                    <Typography class='title'>Change Password</Typography>
                </Grid>
                <Grid item md={8}>
                    <TextField
                        required
                        name="old_password"
                        variant="outlined"
                        label="Current Password"
                        tabIndex={0}
                        type={showCurrentPassword ? "text" : "password"}
                        value={state.old_password}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        onFocus={clearErrorIfExists}
                        error={errors?.old_password ? true : false}
                        helperText={errors?.old_password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" variant="filled" >
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        edge="end"
                                    >
                                        {showCurrentPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item md={8}>
                    <TextField
                        required
                        variant="outlined"
                        name="password"
                        label="Password"
                        tabIndex={5}
                        type={showPassword ? "text" : "password"}
                        value={state.password}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        onFocus={clearErrorIfExists}
                        error={errors?.password ? true : false}
                        helperText={errors?.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" variant="filled" >
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item md={8}>
                    <TextField
                        required
                        variant="outlined"
                        label="Confirm Password"
                        name="password_confirmation"
                        tabIndex={6}
                        type={showConfirmPassword ? "text" : "password"}
                        value={state.password_confirmation}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        onFocus={clearErrorIfExists}
                        error={errors?.password_confirmation ? true : false}
                        helperText={errors?.password_confirmation}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" variant="filled" tabIndex={-1}>
                                    <IconButton
                                        tabIndex={-1}
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item md={6}>
                    <div style={{ maxWidth: "10rem" }}>
                        <RoundedButton
                            square={true}
                            handleSubmit={handlePasswordReset}
                            isLoading={isLoading}
                        >
                            Reset
                        </RoundedButton>
                    </div>
                </Grid>
            </Grid>
            {showToast && (
                <Alert
                    variant="standard"
                    severity={showToast?.status}
                    onClose={() => setShowToast(false)}
                >
                    {showToast?.message}
                </Alert>
            )}
        </div >
    )
}

const materialStyles = (theme) => ({
    container: {
        "& .title": {
            fontSize: "1.75rem",
            color: theme.palette.primary.main,
            fontWeight: 500,
            margin: 0
        },
        "& .MuiTextField-root": { width: '50%' },
        "& .MuiTextField-root > .MuiFormHelperText-root": {
            marginLeft: 2, marginRight: 0
        }
    },
    page: {
        paddingTop: "2.75rem",
        paddingBottom: "6rem"
    }
});

const mapStateToProps = (state) => ({ user: state.user })

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(materialStyles)(Index)));