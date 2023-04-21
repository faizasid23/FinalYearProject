import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  Alert,
  Autocomplete,
  TextField
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RoundedButton from "../../../../components/RoundedButton";
import { addTimesheet, updateTimesheet } from "../../../../apis/student";
import { TimePicker } from "@mui/x-date-pickers";
import { runValidator } from "../../../../utils/validations";
import cloneDeep from "lodash.clonedeep";
import { updateTimesheets } from "../../../../apis/manager";
import { LEAVE_STATUSES } from "../../../../utils/common";

const BASE_AMOUNT = 11;

function EditTimesheetModal(props) {
  let { item, student_id, classes, handleClose } = props;

  const INPUTS = {
    date: {
      rules: { required: true, date: true, maxDate: dayjs().add(1, 'd') }
    },
    checkin: {
      rules: { required: true },
      errorMessage: "Provide the checkin time. "
    },
    checkout: {
      rules: { required: true },
      errorMessage: "Provide the checkout time. "
    }
  };

  const [state, setState] = useState({
    date: null,
    checkin: null,
    checkout: null,
    hours: 0,
    student_earned_amount: 0
  });
  const [status, setStatus] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (Object.keys(item).length !== 0) {
      setState({
        ...item,
        date: dayjs(item.date),
        checkin: dayjs(item.checkin, "hh:mm a"),
        checkout: dayjs(item.checkout, "hh:mm a")
      });
    }
  }, [item]);

  useEffect(() => {
    const { checkin, checkout } = state

    if (checkin && checkout) {

      let duration = dayjs(checkout)?.diff(dayjs(checkin), 'hour', true);

      let hours = parseFloat(duration).toFixed(2);
      if (isNaN(hours)) hours = 0
      let amount = hours * BASE_AMOUNT

      setState((prev) => ({ ...prev, hours: hours, student_earned_amount: amount.toFixed(2) }))
    }
  }, [state])

  const clearErrorIfExists = (name) => {
    if (errors[name]) {
      let uppdatedErrors = cloneDeep(errors);
      delete uppdatedErrors[name];
      setErrors(uppdatedErrors)
    }
  };

  const validateAll = () => {
    let _errors = cloneDeep(errors);
    for (let field in INPUTS) {
      let fieldErrors = runValidator(state[field], INPUTS[field]);
      if (fieldErrors.length > 0) _errors[field] = fieldErrors;
    }
    return _errors;
  };

  const handleInputChange = (name, value) => {
    let isError = false;
    switch (name) {
      case "checkin":
        clearErrorIfExists("checkout")
        if (dayjs(value)?.isAfter(dayjs(state.checkout))) {
          isError = true;
          setErrors({
            [name]: "Start date can't be greater than end date. "
          })
        }
        break;
      case "checkout":
        clearErrorIfExists("checkin")
        if (dayjs(state.checkin)?.isAfter(dayjs(value))) {
          isError = true;
          setErrors({
            [name]: "End date can't be lesser than start date. "
          })
        }
        break;
      default:
        break;
    }
    setState((prev) => ({ ...prev, [name]: value }))
    if (isError === false) clearErrorIfExists(name);
  }


  const handleSubmit = () => {
    let errors = validateAll();

    if (Object.keys(errors).length !== 0) {
      setErrors(errors)
      return
    }
    else {
      // setIsSubmitting(true);

      if (props.role !== "manager") {
        let params = {
          student_id,
          date: dayjs(state.date).format("YYYY-MM-DD") ?? null,
          checkin: dayjs(state.checkin).format("hh:mm a") ?? null,
          checkout: dayjs(state.checkout).format("hh:mm a") ?? null,
          student_earned_amount: state.student_earned_amount,
          hours: state.hours,
          status: 0
        };

        let api = props.item?._id === undefined ? addTimesheet : updateTimesheet;

        api(params, props.item?._id).then((result) => {
          if (result.status === "success") {
            setIsSubmitting(false);
            props.handleSubmit();
          } else {
            setIsSubmitting(false);
            setSubmitMessage({
              status: "error",
              message: result.message ?? "Error has occured",
            });
          }
        });
      } else {
        let params = {
          status: status?.value ?? status
        };

        updateTimesheets(props.item?._id, params).then((result) => {
          if (result.status === "success") {
            setIsSubmitting(false);
            props.handleSubmit();
          } else {
            setIsSubmitting(false);
            setSubmitMessage({
              status: "error",
              message: result.message ?? "Error has occured",
            });
          }
        });
      }
    }
  };

  let isEditOrCreate = props?.role === "manager" ? "Edit" : item.id === undefined ? "Create" : "Edit";
  let buttonText = item.id === undefined ? "Submit" : "Save";

  return (
    <Dialog open={true} classes={{ paper: classes.root }} onClose={handleClose}>
      <DialogTitle className={classes.head}>
        <div className={classes.headInner}>
          <Typography>
            {isEditOrCreate === "Create" ? "Add Timesheet" : "Edit Timesheet"}
          </Typography>
          <IconButton onClick={handleClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent classes={{ root: classes.body }}>
        <Grid container class={classes.container}>
          <Grid item md={12} >
            <DatePicker
              disabled={props?.role === "manager"}
              disableFuture
              label="Date *"
              inputVariant="outlined"
              format="MM/DD/YYYY"
              value={state.date}
              onChange={(newValue) => handleInputChange('date', newValue)}
              slotProps={{
                textField: {
                  error: errors?.date ? true : false,
                  helperText: errors?.date
                }
              }}
            />
          </Grid>
          <div className={classes.rowItem}>
            <TimePicker
              disabled={props?.role === "manager"}
              label="Checkin Time *"
              inputVariant="outlined"
              format="hh:mm a"
              value={state.checkin}
              onChange={(newValue) => handleInputChange('checkin', newValue.toDate())}
              slotProps={{
                textField: {
                  error: errors?.checkin ? true : false,
                  helperText: errors?.checkin
                }
              }}
            />
            <TimePicker
              disabled={props?.role === "manager"}
              label="Checkout Time *"
              inputVariant="outlined"
              format="hh:mm a"
              value={state.checkout}
              onChange={(newValue) => handleInputChange('checkout', newValue.toDate())}
              slotProps={{
                textField: {
                  error: errors?.checkout ? true : false,
                  helperText: errors?.checkout
                }
              }}
            />
          </div>

          <div className={classes.rowItem}>
            <div className={classes.grayedBox}>
              <Typography>Total Hours:</Typography>
              <Typography>{state.hours ?? 0}</Typography>
            </div>

            <div xs={12} item className={classes.grayedBox}>
              <Typography>Earned Amount:</Typography>
              <Typography>£{state.student_earned_amount ?? 0}</Typography>
            </div>
          </div>
          {props.role === "manager" && (
            <Grid item xs={12} sm={6}>
              <Autocomplete
                openOnFocus
                options={LEAVE_STATUSES}
                getOptionLabel={(option) => option.name ?? ""}
                onChange={(_, data) => setStatus(data)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Status"
                    variant="outlined"
                    fullWidth={true}
                    error={errors?.status ? true : false}
                    helperText={errors.status}
                  />
                )}
              />
            </Grid>
          )}
        </Grid>
        {submitMessage && (
          <div className={classes.row}>
            <Alert
              className={classes.submitMessage}
              variant="standard"
              severity={submitMessage.status}
              onClose={() => setSubmitMessage(null)}
            >
              {submitMessage.message}
            </Alert>
          </div>
        )}

        {/* Footer */}
        <div className={classes.footer}>
          <RoundedButton
            handleSubmit={handleClose}
            color="dark"
            square={true}
          >
            Close
          </RoundedButton>
          <RoundedButton
            isLoading={isSubmitting}
            handleSubmit={handleSubmit}
            square={true}
            type="submit"
          >
            {buttonText}
          </RoundedButton>
        </div>
      </DialogContent>
    </Dialog >
  );
}

const materialStyles = (theme) => ({
  root: { width: 560 },
  head: {
    paddingTop: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #DEE2E6",
    "& p": {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: theme.palette.primary.main,
    },
  },
  headInner: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  body: { paddingTop: "1rem" },
  container: {
    padding: "1.5rem 0rem",
    "& .MuiTextField-root": { width: "100%" },
    "& > *": {
      padding: "0.75rem 0rem"
    },
    "& .MuiTextField-root > .MuiFormHelperText-root": {
      marginLeft: 2, marginRight: 0
    }
  },
  row: { marginBottom: "1rem" },
  rowItem: {
    display: 'flex',
    "& :nth-child(1)": { marginRight: "1rem" }
  },
  grayedBox: {
    width: '50%',
    borderRadius: '4px',
    backgroundColor: '#DFDDDD',
    display: 'flex',
    padding: '1rem',
    alignItems: 'center'
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    "& > *": { width: "45%" }
  }
});

export default withStyles(materialStyles)(EditTimesheetModal);