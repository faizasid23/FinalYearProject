import React from "react";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { withRouter } from "../../utils/router";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  CircularProgress
} from "@mui/material";

function DashboardCard(props) {
  const classes = styles();

  return (
    <Card class={classes.card}>
      <CardHeader
        class={classes.header}
        avatar={
          props.icon &&
          <Avatar
            style={{ backgroundColor: props.backgroundColor }}
          >
            {props.icon}
          </Avatar>
        }
        title={<Typography class={classes.title}> {props.title}</Typography >}
      />
      <CardContent class={clsx(classes.ptb0, classes.content)}>
        <div className={classes.count}>
          {props.count === null || props.count === undefined ? (
            <CircularProgress size='2.5rem' />
          ) : (
            typeof props.count === 'function' ? props.count() :
              <Typography>{props.count}</Typography>
          )}
        </div>
      </CardContent >
    </Card >
  );
}

const styles = makeStyles((theme) => {
  return {
    content: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline"
    },
    ptb0: {
      padding: "0rem 1rem !important"
    },
    count: {
      height: "2.75rem",
      display: "flex",
      alignItems: "center",
      width: "100%",
      "& p": {
        fontSize: "1.25rem"
      }
    },
    header: {
      padding: "1rem 1rem 0rem 1rem",
      display: 'flex',
      alignItems: 'center'
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: 500
    },
    card: {
      width: "100%",
      height: "auto",
      boxShadow: "0px 2px 8px 3px rgba(0,0,0,0.1)",
      borderTop: `2px solid ${theme.palette.primary.main}`,
      borderRadius: "0.425rem"
    }
  };
});

export default withRouter(DashboardCard);