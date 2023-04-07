import React from "react";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Chip,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { withStyles } from "@mui/styles";


const LeaveApplicationDetailModal = (props) => {
  let { handleClose, handleEdit, classes } = props;

  const renderStatus = (status) => {
    switch (status) {
      case 1:
        return <Chip label="Approved" className="pill-success" />;
      case 2:
        return <Chip label="Rejected" className="pill-danger" />;
      default:
        return <Chip label="Pending" className="pill-pending" />;
    }
  };

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
      <DialogContent className={classes.modalBody}>
        <Grid
          container
          spacing={1}
          style={{ marginBottom: 16 }}
          className={classes.container}
        >
          <Grid item xs={6} sm={6} md={3}>
            <Typography className={classes.bold}>
              {props.role === "employee" ? "Employer" : "Employee"}:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography>{props.name}</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography className={classes.bold}>Status:</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            {renderStatus(props.item.status)}
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Typography className={classes.bold}>Start Date:</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography>
              {moment(props.item.leave_date).format("MM/DD/YYYY")}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Typography className={classes.bold}>End Date:</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography>
              {props.item.end_date
                ? moment(props.item.end_date).format("MM/DD/YYYY")
                : moment(props.item.leave_date).format("MM/DD/YYYY")}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Typography className={classes.bold}>Date applied:</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography>
              {moment(props.item.created_at).format("MM/DD/YYYY")}
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
                {props.item.leave_type?.name}
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
              {props.item.reason}
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
  bold: { fontWeight: 500 },
  modalBody: { padding: "1rem" },
  container: {
    "& p": { height: 34 },
  },
});
export default withStyles(materialStyles)(LeaveApplicationDetailModal);
