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
import { renderStatus } from "../../../../utils/common";


const LeaveApplicationDetailModal = (props) => {
  let { handleClose, item, classes } = props;

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle className={classes.head}>
        <div className={classes.headInner}>
          <Typography>Leave Application Details</Typography>
          <IconButton onClick={handleClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent class={classes.modalBody}>
        <Grid
          container
          spacing={1}
          style={{ marginBottom: 16 }}
          className={classes.container}
        >
          <Grid item xs={6} sm={6} md={3}>
            <Typography className={classes.bold}>
              Student Name:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography>{item.student_id?.name}</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography className={classes.bold}>Status:</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            {renderStatus(item.status)}
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Typography className={classes.bold}>Start Date:</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography>
              {moment(item.start_date).format("MM/DD/YYYY")}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Typography className={classes.bold}>End Date:</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography>
              {item.end_date
                ? moment(item.end_date).format("MM/DD/YYYY")
                : moment(item.start_date).format("MM/DD/YYYY")}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Typography className={classes.bold}>Date applied:</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography>
              {moment(item.date_applied).format("MM/DD/YYYY")}
            </Typography>
          </Grid>
          <Grid container item xs={3}>
            <Typography>
              <span className={classes.bold}>Type: </span>
            </Typography>
          </Grid>
          <Grid container item xs={3}>
            <Typography>
              <span style={{ textTransform: "capitalize" }}>
                {item.leave_type}
              </span>
            </Typography>
          </Grid>

          <Grid container item xs={12} md={3}>
            <Typography>
              <span className={classes.bold}>Reason: </span>
            </Typography>
          </Grid>

          <Grid item xs={12} md={9}>
            <Typography style={{ whiteSpace: "pre-wrap", wordBreak: "break" }}>
              {item.reason}
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
    "& p": { height: 34 },
  },
});
export default withStyles(materialStyles)(LeaveApplicationDetailModal);
