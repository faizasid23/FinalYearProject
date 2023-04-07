import React from "react";
import { withStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import clsx from "clsx";

const Footer = ({ classes, inside }) => (
    <footer className={clsx(inside ? classes.insideFooter : classes.footer)}>
        <Typography>©2022 GSK</Typography>
    </footer>
);

const materialStyles = (theme) => ({
    footer: {
        margin: '0px 30px',
        marginTop: '10rem',
        padding: '15px 0px',
        borderTop: '1px solid rgba(84, 79, 64, .2)',
        "& p": { color: "rgba(84, 79, 64, .6)", fontSize: ".875rem" }
    },
    insideFooter: {
        margin: '0px 30px',
        marginTop: '10rem',
        marginLeft: '19%',
        padding: '15px 0px 15px 10px',
        borderTop: '1px solid rgba(84, 79, 64, .2)',
        "& p": { color: "rgba(84, 79, 64, .6)", fontSize: ".875rem" }
    }
});

export default withStyles(materialStyles)(Footer);