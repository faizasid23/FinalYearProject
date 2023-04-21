import { ButtonBase, Collapse, Tooltip, Typography } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import { withStyles } from '@mui/styles'

const Index = (props) => {
    let { classes } = props;
    const [isExpanded, setExpansion] = useState(false);

    return (
        <form onSubmit={props.onChange}>
            <div className={classes.headRow}>
                {props.leftSideComponent ?? <div></div>}
                <div className={classes.rightSide}>
                    {props.filterBtn === "show" &&
                        <Tooltip title="Filter Search">
                            <ButtonBase
                                disableRipple
                                class={classes.miniBlueButton}
                                onClick={() => setExpansion(!isExpanded)}
                            >
                                <FilterListIcon htmlColor="#fff" />
                            </ButtonBase>
                        </Tooltip>
                    }
                    {props.rightSideComponent ?? <div></div>}
                </div>
            </div>
            {props.filterBtn === "show" && (
                <Collapse in={isExpanded}>
                    <div className={classes.filtersContainer}>
                        {props.renderFilterInputs?.()}
                        <ButtonBase
                            disableRipple
                            type="submit"
                            class={classes.searchButton}
                            onClick={props.onChange}
                        >
                            <SearchIcon htmlColor="#fff" />
                        </ButtonBase>
                        <Typography class={classes.clearButton} onClick={props.onClear}>
                            Clear
                        </Typography>
                    </div>
                </Collapse>
            )}
        </form>
    );
};

const materialStyles = (theme) => ({
    headRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    rightSide: {
        display: "flex",
        "& > :nth-child(2)": { marginLeft: "1rem" },
    },
    miniBlueButton: {
        backgroundColor: theme.palette.primary.main,
        height: "3rem",
        width: "3rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "0.3125rem",
        border: 'none',
        cursor: "pointer",
        "&:hover": {
            backgroundColor: theme.palette.primary.dark
        }
    },
    searchButton: {
        backgroundColor: "#50C73E",
        borderRadius: "0.3125rem",
        overflow: "hidden",
        marginLeft: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "3rem",
        width: "3rem",
        cursor: "pointer",
        "&:hover": { background: "#48bf36" },
        border: 0,
        outline: "none",
        [theme.breakpoints.down("sm")]: { height: 36, width: 36 },
    },
    clearButton: {
        marginLeft: "1rem !important",
        height: "3rem",
        cursor: "pointer",
        borderRadius: "0.3125rem",
        color: "#888888",
        padding: "0 1rem",
        border: "1px solid #888888",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: { height: 36 },
    },
    filtersContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: '1rem',
        "& .MuiTextField-root > .MuiFormHelperText-root": {
            marginLeft: 2, marginRight: 0
        }
    }
});

export default withStyles(materialStyles)(Index);