import React from "react";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { withStyles } from "@mui/styles";

const TimesheetDetailModal = (props) => {
  let { handleClose, item, classes } = props;

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle className={classes.head}>
        <div className={classes.headInner}>
          <Typography>Timesheet Details</Typography>
          <IconButton onClick={handleClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent class={classes.modalBody}>
        <Grid
          container
          spacing={2}
          style={{ marginBottom: 16 }}
          className={classes.container}
        >
          <Grid item md={6}>
            <Typography className={classes.bold}>
              Date:
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography>{moment(item.date).format("MM/DD/YYYY")}</Typography>
          </Grid>

          <Grid item md={6}>
            <Typography className={classes.bold}>Check In Time:</Typography>
          </Grid>
          <Grid item md={6}>
            <Typography>
              {moment(item.checkin, 'hh:mm a').format("hh:mm a")}
            </Typography>
          </Grid>

          <Grid item md={6}>
            <Typography className={classes.bold}>Check Out Time:</Typography>
          </Grid>
          <Grid item md={6}>
            <Typography>
              {moment(item.checkout, 'hh:mm a').format("hh:mm a")}
            </Typography>
          </Grid>

          <Grid item md={6}>
            <Typography className={classes.bold}>Total Hours Logged:</Typography>
          </Grid>
          <Grid item md={6}>
            <Typography>
              {item.hours} hours
            </Typography>
          </Grid>

          <Grid item md={6}>
            <Typography>
              <span className={classes.bold}>Amount Earned by {props?.role === 'manager' ? "student" : 'you'}: </span>
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography>
              <span style={{ textTransform: "capitalize" }}>
                £{item.student_earned_amount}
              </span>
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const materialStyles = (theme) => ({
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
  footerContainer: {
    marginTop: ".5rem",
    display: "flex",
    justifyContent: "center",
    "& > :first-child": {
      minWidth: 320,
      width: "80%",
      display: "flex",
      justifyContent: "space-between",
      "& > *": { width: "45%" },
    },
  },
  dialogPaper: { maxWidth: 680, width: 600 },
  bold: { fontWeight: "600 !important" },
  modalBody: { padding: "1.25rem" },
  container: {
    "& p": {
      backgroundColor: "#DFDDDD",
      padding: "1rem"
    },
  },
});
export default withStyles(materialStyles)(TimesheetDetailModal);
