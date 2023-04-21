import React, { useState, useEffect } from "react";
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
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RoundedButton from "../../../../components/RoundedButton";
import { runValidator } from "../../../../utils/validations";
import cloneDeep from "lodash.clonedeep";
import { PROGRAMS } from "../../../../utils/common";
import moment from "moment";
import { addEffortTracking, updateEffortTracking } from "../../../../apis/student";

function EditEffortModal(props) {
  let { item, mode, student_id, classes, handleClose } = props;

  const INPUTS = {
    project_name: {
      rules: { required: true },
      errorMessage: "Select a Project from the above. "
    },
    hours: {
      rules: { max: mode === "weekly" ? 40 : mode === "daily" ? 8 : 150 },
      // errorMessage: "Log the hours for the project. "
    }
  };

  const [state, setState] = useState({
    project_name: "",
    hours: 0,
    hours_against: mode === "monthly" ? moment().format('MMMM') : mode === "weekly" ? moment().startOf('isoWeek').format('MM/DD/YYYY') + " - " + moment().endOf('isoWeek').format('MM/DD/YYYY') : moment().format('MM/DD/YYYY'),
    mode
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (Object.keys(item).length !== 0) {
      setState({ ...item });
    }
  }, [item]);

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
    clearErrorIfExists(name);
    setState((prev) => ({ ...prev, [name]: value }))
  }


  const handleSubmit = () => {
    let errors = validateAll();

    if (Object.keys(errors).length !== 0) {
      setErrors(errors)
      return
    }
    else {
      setIsSubmitting(true);

      let params = {
        student_id,
        project_code: state.project_name?.code ?? state.project_code,
        project_name: state.project_name?.name ?? state.project_name,
        hours: state.hours,
        hours_against: state.hours_against,
        mode: state.mode,
        status: 1
      };
      let api = props.item?._id === undefined ? addEffortTracking : updateEffortTracking;

      api(params, props.item?._id).then((result) => {
        if (result.status === "success") {
          setIsSubmitting(false);
          props.handleSubmit();
        } else {
          setIsSubmitting(false);
          setErrors(result.errors ?? {})
          setSubmitMessage({
            status: "error",
            message: result.message ?? "Error has occured",
          });
        }
      });
    }
  };

  let isEditOrCreate = item.id === undefined ? "Create" : "Edit";
  let buttonText = item.id === undefined ? "Submit" : "Save";

  return (
    <Dialog open={true} classes={{ paper: classes.root }} onClose={handleClose}>
      <DialogTitle className={classes.head}>
        <div className={classes.headInner}>
          <Typography>
            {isEditOrCreate === "Create" ? "Add New Effort Track" : "Edit Effort Track"}
          </Typography>
          <IconButton onClick={handleClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent classes={{ root: classes.body }}>
        <Grid container class={classes.container}>
          <Grid item md={12} >
            <Autocomplete
              options={PROGRAMS}
              value={state.project_name}
              getOptionLabel={(option) => option.code ? option.code + ' - ' + option.name : option}
              onChange={(_, data) => handleInputChange("project_name", data)}
              isOptionEqualToValue={(option, value) => option?.name === (value?.name ?? value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Project Name"
                  variant="outlined"
                  fullWidth={true}
                  error={errors?.project_name ? true : false}
                  helperText={errors?.project_name}
                />
              )}
            />
          </Grid>
          <div className={classes.rowItem}>
            <TextField
              required
              variant="outlined"
              label="Hours"
              name="hours"
              value={state.hours}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              inputProps={{ maxLength: 6 }}
              error={errors?.hours ? true : false}
              helperText={errors?.hours}
            />
            <Typography>for the {mode === 'daily' ? 'date' : mode.substring(0, mode.length - 2)} of {state.hours_against}</Typography>
          </div>
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
  root: { width: 610 },
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
    "& > *": { width: '50% !important' },
    "& > p": {
      padding: '1rem', color: 'gray', backgroundColor: '#DFDDDD',
      fontSize: '0.875rem', maxHeight: '1.5rem'
    }
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    "& > *": { width: "45%" }
  }
});

export default withStyles(materialStyles)(EditEffortModal);