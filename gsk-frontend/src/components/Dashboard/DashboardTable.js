import React, { useState, useEffect } from "react";
import { withRouter } from "../../utils/router";
import { makeStyles } from "@mui/styles";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  CircularProgress,
} from "@mui/material";

function DashboardTable(props) {
  let { history } = props;

  const classes = styles();
  let { api } = props;

  const [data, setData] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    api().then((result) => { setData(result?.data ?? []); });
    // eslint-disable-next-line
  }, [api]);

  return (
    <div className={classes.sideWidget}>
      <Typography className={"header"}>{props.title}</Typography>
      <div className={classes.bodyContent}>
        {data.length === 0 ? (
          <div className={classes.empty}>
            {props.emptyIcon}
            <Typography>{props.emptyText}</Typography>
          </div>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow className={classes.thtr}>
                  {props.columns.map((item, index) => {
                    return (
                      <TableCell
                        key={index}
                        className={classes.th}
                        component="th"
                        align="left"
                      >
                        {item.title}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 ? (
                  <CircularProgress />
                ) : (
                  data?.map((row, rowindex) => {
                    return (
                      <TableRow key={rowindex} className={classes.tdtr}>
                        {props.columns.map((col, colindex) => {
                          return (
                            <TableCell key={colindex} className={classes.td} component="td">
                              {props.updateSelectedIndex !== undefined
                                ? col?.render
                                  ? col.render(
                                    row,
                                    history,
                                    props.updateSelectedIndex
                                  )
                                  : row[col.dbName]
                                : col?.render
                                  ? col.render(row, history, props.drawerOpen)
                                  : row[col.dbName]}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            <Typography
              className={classes.link}
              onClick={() => {
                if (props.url) {
                  history(props.url);
                  if (props.updateSelectedIndex !== undefined) {
                    props.updateSelectedIndex();
                  }
                }
              }}
            >
              {props.urlText}
            </Typography>
          </>
        )}
      </div>
    </div>
  );
}

const styles = makeStyles((theme) => {
  return {
    thtr: {
      "& > :nth-child(2)": {
        textAlign: "center",
      },
    },
    tdtr: {
      "& > :nth-child(2)": {
        textAlign: "center",
      },
    },
    empty: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      color: "#ADB5BD",
      textDecoration: "underline"
    },
    th: {
      fontSize: "0.875rem",
      color: "#006AB3",
    },
    td: {
      fontSize: "0.875rem",
      color: "#000",
    },
    bodyContent: {
      borderRadius: "0.5rem 0.5rem 0.5rem 0.5rem",
      overflow: "hidden",
      backgroundColor: "#fff",
      height: "24.6875rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    link: {
      padding: "1.40rem 1rem 1rem 0",
      color: "#6C63FF",
      textDecoration: "underline",
      cursor: "pointer",
    },
    sideWidget: {
      width: "100%",
      borderRadius: "0.425rem 0.425rem 0 0",
      overflow: "hidden",
      boxShadow: "0px 2px 8px 3px rgba(0,0,0,0.1)",
      "& > .header": {
        height: "3.5rem",
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        backgroundColor: theme.palette.primary.main,
        fontSize: "1.125rem",
        fontWeight: 500
      }
    }
  };
});

export default withRouter(DashboardTable);