import React from 'react'
import { withStyles } from '@mui/styles';
import { Typography } from '@mui/material';

function index(props) {
    let { classes } = props;

    return (
        <div className={classes.container}>
            <div className={classes.centralContent}>
                <Typography className="heading">404</Typography>
                <Typography className="text">
                    Ooops, page not found
                </Typography>
            </div>
        </div>
    )
}

const materialStyles = (theme) => ({
    container: {
        height: "100vh",
        width: "100%",
        backgroundColor: theme.palette.primary.main,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    centralContent: {
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        "& > p": { color: "inherit !important" },
        "& > .heading": {
            fontSize: "6.125rem",
            fontWeight: 500,
            marginBottom: ".325rem",
        },
        "& > .text": {
            fontSize: "1.25rem",
            textAlign: "center"
        }
    }
});


export default withStyles(materialStyles)(index);