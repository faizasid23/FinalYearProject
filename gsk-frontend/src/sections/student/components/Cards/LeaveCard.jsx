import React, { Component } from "react";
import moment from "moment";
import { withRouter } from '../../../../utils/router'
import { Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArticleIcon from '@mui/icons-material/Article';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {
      classes,
      key,
      date_applied,
      leave_type,
      start_date,
      reason,
      end_date,
      status,
      renderControls,
    } = this.props;

    return (
      <div className={classes.root} key={key}>
        <div className={classes.body}>
          <div className={classes.left}>
            <Typography class={classes.jobTitle}>
              {leave_type} Leave
            </Typography>

            <div className={classes.fullWidthRow}>
              <div className={classes.infoRow}>
                <div
                  className={classes.infoRowItem}
                  style={{ minWidth: "9.5rem" }}
                >
                  <CalendarMonthIcon htmlColor="#6C63FF" />
                  <Typography>
                    <span>From: &nbsp;</span>
                    <span>{moment(start_date).format("MM/DD/YYYY")}</span>
                  </Typography>
                </div>
                <div className={classes.infoRowItem}>
                  <CalendarMonthIcon htmlColor="#FC443E" />
                  <Typography>
                    <span>Till: &nbsp;</span>
                    <span>
                      {end_date ? moment(end_date).format("MM/DD/YYYY") : "NA"}
                    </span>
                  </Typography>
                </div>
              </div>
            </div>
            <div className={classes.infoRow}>
              <div className={classes.infoRowItem}>
                <CalendarMonthIcon htmlColor="#4AACEB" />
                <Typography>
                  <span>Date Applied: &nbsp;</span>
                  <span>{moment(date_applied).format("MM/DD/YYYY")}</span>
                </Typography>
              </div>
              <div className={classes.infoRowItem}>
                <ArticleIcon htmlColor="#eb8f15" />
                <Typography>
                  <span>Reason: &nbsp;</span>
                  <span>
                    {reason.length > 20 ? `${reason.slice(0, 20)}...` : reason}
                  </span>
                </Typography>
              </div>
            </div>
          </div>
          <div className={classes.right}>
            <Typography>{status}</Typography>
            <Typography>{renderControls()}</Typography>
          </div>
        </div>
      </div>
    );
  }
}

const materialStyles = (theme) => ({
  root: {
    backgroundColor: "#fff",
    borderRadius: "0.425rem",
    boxShadow: "0px 2px 8px 3px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
    "&:not(:last-child)": { marginBottom: "1.5rem" },
  },
  body: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1.875rem 2.35rem",
    flexGrow: 1,
    [theme.breakpoints.down("sm")]: {
      padding: "1.5rem",
    },
  },
  left: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  jobTitle: {
    fontWeight: 500,
    lineHeight: 1,
    fontSize: "1.5rem",
    marginBottom: "1.25rem !important",
  },
  infoRow: {
    display: "flex",
    marginBottom: "0.725rem",
    "& > :first-child": {
      marginRight: "1.5rem",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      marginBottom: "0rem",
    },
  },
  infoRowItem: {
    display: "flex",
    alignItems: "center",
    width: "16rem",
    whiteSpace: "nowrap",
    "& > :first-child": {
      marginRight: "0.75rem",
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: "0.5rem",
    },
  },
  right: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  fullWidthRow: {
    display: "flex",
    justifyContent: "space-between",
  },
});

export default withRouter(withStyles(materialStyles)(Card));
