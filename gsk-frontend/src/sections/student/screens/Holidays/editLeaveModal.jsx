import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Typography,
  Hidden,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  IconButton,
  Autocomplete, Alert
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RoundedButton from "../../../../components/RoundedButton";
import { applyLeave, updateLeave } from "../../../../apis/student";
import { LEAVE_STATUSES } from "../../../../utils/common";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";

const schema = yup.object().shape({
  employee_applied_job_id: yup.string().nullable(),
  leave_date: yup.date().nullable()
    .max(yup.ref("end_date"), "Start date can't be after end date. ")
    .required("Start date is required. ")
    .typeError("Invalid Date Format (format: MM/DD/YYYY).  "),
  end_date: yup.date().nullable()
    .min(yup.ref("leave_date"), "End date can't be before start date. ")
    .required("End date is required. ")
    .typeError("Invalid Date Format (format: MM/DD/YYYY).  "),
  leave_type: yup.object().nullable().required("Select a leave type. "),
  reason: yup.string().required("Kindly provide a reason. ")
    .test('len', 'Description is too short, explain more. ', val => val.length > 5)
    .nullable()
});

function EditLeaveModal(props) {
  let { item, classes, handleClose } = props;

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      employee_applied_job_id: null,
      leave_date: null,
      end_date: null,
      leave_type: null,
      status: null,
      reason: "",
    },
  });

  useEffect(() => {
    if (props.item) {
      setValue("leave_date", item.leave_date ? moment(item.leave_date) : null);
      setValue("end_date", item.end_date ? moment(item.end_date) : null);
      setValue("leave_type", item.leave_type ?? null);
      setValue("reason", item.reason);
      setValue(
        "status",
        LEAVE_STATUSES.filter((status) => status.value === item.status)[0] ?? null
      );
    } else {
      setValue(
        "status",
        LEAVE_STATUSES.filter((status) => status.value === 0)[0] ?? null
      );
    }
  }, [
    item.leave_date,
    item.end_date,
    item.leave_type,
    item.reason,
    item.status,
    props.item,
    setValue,
  ]);

  const onSubmit = (data) => {
    setIsSubmitting(true);

    let status = typeof data.status === "object" ? data.status?.value : data.status;
    let submit_data = {
      leave_type_id: data.leave_type?.id ?? null,
      reason: data.reason ?? null,
      leave_date: moment(data.leave_date).format("YYYY-MM-DD HH:mm:ss") ?? null,
      end_date: moment(data.end_date).format("YYYY-MM-DD HH:mm:ss") ?? null,
      employee_applied_job_id: props.employee_applied_job_id,
      status: status
    };
    let api = props.item.id === undefined ? applyLeave : updateLeave;

    api(submit_data, props.item.id).then((result) => {
      if (result.status === "success") {
        setIsSubmitting(false);
        props.handleSubmit();
      } else {
        setIsSubmitting(false);
        setSubmitMessage({
          status: "error",
          message: result.message ? result.message : "Error has occured",
        });
      }
    });
  };

  let isEditOrCreate = item.id === undefined ? "Create" : "Edit";
  let buttonText = item.id === undefined ? "Submit" : "Save";

  return (
    <Dialog open={true} classes={{ paper: classes.root }} onClose={handleClose}>
      <DialogTitle className={classes.head}>
        <div className={classes.headInner}>
          <Typography>
            {isEditOrCreate === "Create"
              ? "Apply Leave"
              : "Edit Leave Application"}{" "}
          </Typography>
          <IconButton onClick={handleClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent classes={{ root: classes.body }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4} class={classes.container}>
            <Grid md={12} item>
              <Controller
                name="leave_date"
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <DatePicker
                    required
                    fullWidth={true}
                    label="Start Date *"
                    inputVariant="outlined"
                    onClose={rest.onBlur}
                    // onError={Boolean(errors.leave_date)}
                    {...rest}
                  />
                  // <KeyboardDatePicker
                  //   label="Start Date "
                  //   inputVariant="outlined"
                  //   required
                  //   format="MM/DD/YYYY"
                  //   placeholder="MM/DD/YYYY"
                  //   fullWidth={true}
                  //   autoOk={true}
                  //   onClose={rest.onBlur}
                  //   error={Boolean(errors.leave_date)}
                  //   helperText={errors.leave_date?.message}
                  //   KeyboardButtonProps={{ "aria-label": "Start Date" }}
                  //   {...rest}
                  // />
                )}
              />
            </Grid>
            <Grid md={12} item>
              <Controller
                name="end_date"
                control={control}
                render={({ field: { ref, ...rest } }) => {
                  return (
                    <DatePicker
                      required
                      fullWidth={true}
                      label="End Date *"
                      inputVariant="outlined"
                      onClose={rest.onBlur}
                      // onError={Boolean(errors.leave_date)}
                      {...rest}
                    />
                    // <KeyboardDatePicker
                    //   label="End Date "
                    //   inputVariant="outlined"
                    //   required
                    //   format="MM/DD/YYYY"
                    //   placeholder="MM/DD/YYYY"
                    //   fullWidth={true}
                    //   autoOk={true}
                    //   onClose={rest.onBlur}
                    //   error={Boolean(errors.end_date)}
                    //   helperText={errors.end_date?.message}
                    //   KeyboardButtonProps={{ "aria-label": "End Date" }}
                    //   {...rest}
                    // />
                  );
                }}
              />
            </Grid>

            <Grid xs={12} sm={12} item>
              <Controller
                name="leave_type"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={leaveTypes}
                    getOptionLabel={(option) => option.name ?? ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Leave Type"
                        variant="outlined"
                        fullWidth={true}
                        error={Boolean(errors.leave_type)}
                        helperText={errors.leave_type?.message}
                      />
                    )}
                    onChange={(_, data) => field.onChange(data)}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} item>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    required
                    variant="outlined"
                    label="Reason"
                    error={Boolean(errors.reason)}
                    helperText={errors.reason?.message}
                    maxRows={4}
                    fullWidth={true}
                    inputProps={{ maxLength: 500 }}
                  />
                )}
              />
            </Grid>
            {/* {props.role !== "student" && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      openOnFocus
                      options={LEAVE_STATUSES}
                      getOptionLabel={(option) => option.name ?? ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Status"
                          variant="outlined"
                          fullWidth={true}
                          error={Boolean(errors.status)}
                          helperText={errors.status}
                        />
                      )}
                      onChange={(_, data) => field.onChange(data)}
                    />
                  )}
                />
              </Grid>
            )} */}
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
              handleSubmit={handleSubmit(onSubmit)}
              square={true}
              type="submit"
            >
              {buttonText}
            </RoundedButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
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
    padding: "2rem 0rem",
    "& > *": {
      padding: 5
    },
    "& .MuiTextField-root > .MuiFormHelperText-root": {
      marginLeft: 2, marginRight: 0
    }
  },
  row: { marginBottom: "1rem" },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    "& > *": { width: "45%" }
  }
});

export default withStyles(materialStyles)(EditLeaveModal);