import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Typography,
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
import { updateHolidayRequest } from "../../../../apis/manager";

const schema = yup.object().shape({
  student_id: yup.string().nullable(),
  start_date: yup.date().required("Start date is required. ")
    .typeError("Invalid Date Format (format: MM/DD/YYYY).  "),
  end_date: yup.date().required("End date is required. ")
    .min(yup.ref("start_date"), "End date can't be before start date. ")
    .typeError("Invalid Date Format (format: MM/DD/YYYY).  "),
  leave_type: yup.lazy(value => {
    switch (typeof value) {
      case 'object':
        return yup.object().required("Select a leave type. "); // schema for object
      case 'string':
        return yup.string().required("Select a leave type. ") // schema for string
      default:
        return yup.mixed(); // here you can decide what is the default
    }
  }),
  reason: yup.string().required("Provide a reason for your leave. ")
    .test('len', 'Description is too short, explain more. ', val => val.length > 5)
    .nullable()
});

const LEAVE_TYPES = [
  { name: 'Casual Leave', value: 'Casual' },
  { name: 'Sick Leave', value: 'Sick' },
  { name: 'Vacation Leave', value: 'Vacation' },
]

function EditLeaveModal(props) {
  let { leave, classes, handleClose } = props;

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
      student_id: null,
      start_date: null,
      end_date: null,
      leave_type: null,
      status: null,
      reason: "",
    },
  });

  useEffect(() => {
    if (leave) {
      setValue("start_date", leave.start_date ? dayjs(leave.start_date) : null);
      setValue("end_date", leave.end_date ? dayjs(leave.end_date) : null);
      setValue("leave_type", leave.leave_type ?? null);
      setValue("reason", leave.reason);
      setValue(
        "status",
        LEAVE_STATUSES.filter((status) => status.value === leave.status)[0] ?? null
      );
    }
  }, [
    leave,
    setValue,
  ]);

  const onSubmit = (data) => {
    setIsSubmitting(true);

    if (props.role !== "student") {
      let params = {
        status: data?.status?.value ?? data?.status
      };

      updateHolidayRequest(props.leave?._id, params).then((result) => {
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
    else {
      let params = {
        student_id: leave.student_id?._id ?? leave.student_id,
        leave_type: data.leave_type?.value ?? data.leave_type,
        reason: data.reason ?? null,
        start_date: dayjs(data.start_date).format("YYYY-MM-DD") ?? null,
        end_date: dayjs(data.end_date).format("YYYY-MM-DD") ?? null,
        date_applied: dayjs().format("YYYY-MM-DD"),
        status: 0
      };

      let api = props.leave?._id === undefined ? applyLeave : updateLeave;

      api(params, props.leave?._id).then((result) => {
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
  };

  let isEditOrCreate = props?.role !== "student" ? "Edit" : leave.id === undefined ? "Create" : "Edit";
  let buttonText = leave.id === undefined ? "Submit" : "Save";

  return (
    <Dialog open={true} classes={{ paper: classes.root }} onClose={handleClose}>
      <DialogTitle className={classes.head}>
        <div className={classes.headInner}>
          <Typography>
            {isEditOrCreate === "Create" ? "Apply Leave" : "Edit Leave"}
          </Typography>
          <IconButton onClick={handleClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent classes={{ root: classes.body }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container class={classes.container}>
            <Grid md={12} item>
              <Controller
                name="start_date"
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <DatePicker
                    disabled={props.role !== "student"}
                    label="Start Date *"
                    inputVariant="outlined"
                    onClose={rest.onBlur}
                    slotProps={{
                      textField: {
                        error: Boolean(errors.start_date),
                        helperText: errors.start_date?.message
                      }
                    }}
                    {...rest}
                  />
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
                      disabled={props.role !== "student"}
                      label="End Date *"
                      inputVariant="outlined"
                      onClose={rest.onBlur}
                      slotProps={{
                        textField: {
                          error: Boolean(errors.end_date),
                          helperText: errors.end_date?.message
                        }
                      }}
                      {...rest}
                    />
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
                    disabled={props.role !== "student"}
                    options={LEAVE_TYPES}
                    getOptionLabel={(option) => option.name ?? option}
                    isOptionEqualToValue={(option, value) => option?.value === (value?.value ?? value)}
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
                    disabled={props.role !== "student"}
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
            {props.role !== "student" && (
              <Grid item md={12}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      openOnFocus
                      options={LEAVE_STATUSES}
                      getOptionLabel={(option) => option.name ?? ""}
                      isOptionEqualToValue={(option, value) => option?.value === (value?.value ?? value)}
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
    "& .MuiTextField-root": { width: "100%" },
    "& > *": {
      padding: "0.75rem 0rem"
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