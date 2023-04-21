import React, { Component } from "react";
import { withRouter } from "../../utils/router"
import queryString from "query-string";
import {
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,
    Typography,
    IconButton,
    CircularProgress,
    Chip,
    Box,
    Pagination
} from "@mui/material";
import { withStyles } from "@mui/styles";
// importing icons
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

class DataTable extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.tableRef = React.createRef();
    }

    scrollToTop = () => {
        if (this.tableRef.current)
            window.scrollTo({
                top: this.tableRef.current.offsetTop,
                behavior: "smooth",
            });
    };

    handlePageDecrement = () => {
        let queryParams = queryString.parse(this.props.location.search);
        let page = queryParams.page ? parseInt(queryParams.page) : 1;
        this.handlePageChange(page - 1);
    };

    handlePageIncrement = () => {
        let queryParams = queryString.parse(this.props.location.search);
        let page = queryParams.page ? parseInt(queryParams.page) : 1;
        this.handlePageChange(page + 1);
    };

    handlePageChange = async (e, page) => {
        // call the update query params
        // update the page number
        // get the data
        let queryParams = queryString.parse(this.props.location.search);
        queryParams.page = page;

        await this.props.history.push(
            `${window.location.pathname}?${queryString.stringify(queryParams)}`
        );
        this.props.getDataFromAPI();
        this.scrollToTop();
    };

    handleSorting = async (column) => {
        let queryParams = queryString.parse(this.props.location.search);
        if (queryParams.sort_by && queryParams.sort_by === column) {
            queryParams.sort_order =
                queryParams.sort_order === "asc" ? "desc" : "asc";
        } else {
            queryParams.sort_by = column;
            queryParams.sort_order = "asc";
        }

        await this.props.history.push(
            `${window.location.pathname}?${queryString.stringify(queryParams)}`
        );
        this.props.getDataFromAPI();
        this.scrollToTop();
    };

    renderData() {
        let { classes, data, columns, renderControls } = this.props;

        return (
            <TableBody
                style={{ borderTop: "0px" }}
                className={classes.tableInnerBody}
            >
                <span className={classes.preBorder}>&nbsp;</span>
                <span className={classes.proBorder}>&nbsp;</span>
                {data?.length > 0 ? (
                    data.map((row, idx) => (
                        <TableRow key={idx}>
                            {columns.map((column, rowIdx) => (
                                <TableCell key={rowIdx} style={{ verticalAlign: "center" }}>
                                    {this.renderItem(column, row)}
                                </TableCell>
                            ))}
                            {renderControls &&
                                <TableCell
                                    style={{ paddingTop: 0, paddingBottom: 0, width: 100 }}
                                >
                                    {/* action icon buttons */}
                                    <Box className={classes.actionButtonContainers}>
                                        {renderControls(idx)}
                                    </Box>
                                </TableCell>
                            }
                        </TableRow>
                    ))
                ) : (
                    <TableRow key={100}>
                        <TableCell
                            colSpan={columns.length + 1}
                            style={{ textAlign: "center" }}
                        >
                            No records found
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        );
    }

    renderItem = (column, row) => {
        if (column.isPill !== undefined) {
            return this.renderPill(row[column.dbName], column.isPill);
        } else if (column.render !== undefined) {
            return column.render(row);
        } else {
            return row[column.dbName];
        }
    };

    renderPill = (value, pill) => {
        let htmlColor = "#00c853";
        let text = value;
        let pillClass = "";
        if (typeof value === "boolean") {
            text = value === true ? pill.successText : `Not ${pill.successText}`;
            htmlColor = value === true ? "#00c853" : "#f44336";
            pillClass = value === true ? "pill-success" : "pill-danger";
        } else if (typeof value === "number") {
            text = value === 1 ? pill.successText : `Not ${pill.successText}`;
            htmlColor = value === 1 ? "#00c853" : "#f44336";
        } else if (value === pill.successText) {
            htmlColor = "#00c853";
            text = value;
            pillClass = "pill-success";
        } else if (value === pill.pendingText) {
            htmlColor = "#ffbd59";
            text = value;
            pillClass = "pill-pending";
        } else if (value === pill.blueText) {
            htmlColor = "#006ab3";
            text = value;
            pillClass = "pill-info";
        } else if (value === pill.dangerText) {
            htmlColor = "#f44336";
            text = value;
            pillClass = "pill-danger";
        } else if (value === pill.skyText) {
            htmlColor = "#3399FF";
            text = value;
            pillClass = "pill-info";
        } else {
            htmlColor = "#f44336";
            text = "Not " + pill.successText;
            pillClass = "pill-danger";
        }

        return (
            <Chip
                className={pillClass}
                style={{
                    textTransform: "capitalize",
                    color: "#fff",
                    backgroundColor: htmlColor,
                }}
                size="small"
                label={text}
            />
        );
    };

    renderActions = (type, rowIdx, idx) => {
        let { showModal } = this.props;
        switch (type) {
            case "Edit":
                return (
                    <IconButton key={idx} onClick={() => showModal("Edit", rowIdx)}>
                        <EditOutlinedIcon />
                    </IconButton>
                );
            case "Delete":
                return (
                    <IconButton key={idx} onClick={() => showModal("Delete", rowIdx)}>
                        <DeleteOutlineOutlinedIcon />
                    </IconButton>
                );
            case "View":
                return (
                    <IconButton key={idx} onClick={() => showModal("View", rowIdx)}>
                        <VisibilityOutlinedIcon />
                    </IconButton>
                );
            case "Restore":
                return (
                    <IconButton key={idx} onClick={() => showModal("Restore", rowIdx)}>
                        <RestoreOutlinedIcon />
                    </IconButton>
                );
            default:
                return;
        }
    };

    renderLoading() {
        let { columns } = this.props;
        return (
            <TableBody
                style={{
                    position: "relative",
                    borderTop: "0px",
                    backgroundColor: "#fff",
                }}
            >
                <TableRow>
                    <TableCell colSpan={columns.length + 1} align={"center"}>
                        <div
                            style={{
                                height: "30vh",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <CircularProgress />
                        </div>
                    </TableCell>
                </TableRow>
            </TableBody>
        );
    }

    render() {
        let { classes, columns, count, isLoading, entries } = this.props;
        const queryParams = queryString.parse(this.props.location.search); // location is used to alter the queryString on runtime
        //Paramters for datatable
        let pagination = {
            itemsPerPage: 10,
            page: queryParams.page ?? 1,
        };
        let sorting = {
            sort_by: queryParams.sort_by,
            sort_order: queryParams.sort_order,
        };
        let showActions =
            this.props.actions !== undefined ||
            this.props.renderControls !== undefined;
        return (
            <div ref={this.tableRef} className={classes.root}>
                <TableContainer style={{ marginBottom: 26 }}>
                    <Table>
                        <TableHead className="tableHead" classes={{ root: classes.head }}>
                            <TableRow>
                                {/* Dynamic Header Cells */}
                                {columns.map((column, idx) => (
                                    <TableCell style={{ verticalAlign: "center" }} key={idx}>
                                        {column.sortable === false ? (
                                            <Typography
                                                style={{
                                                    fontWeight: 500,
                                                    display: "inline-block",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {column.title}
                                            </Typography>
                                        ) : (
                                            <TableSortLabel
                                                active={sorting.sort_by === column.dbName}
                                                direction={
                                                    sorting.sort_order === "desc" ? "desc" : "asc"
                                                }
                                                onClick={() => this.handleSorting(column.dbName)}
                                            >
                                                <Typography
                                                    style={{
                                                        fontWeight: 500,
                                                        display: "inline-block",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {column.title}
                                                </Typography>
                                            </TableSortLabel>
                                        )}
                                    </TableCell>
                                ))}
                                {/* Actions Header Cell */}
                                {showActions && (
                                    <TableCell
                                        style={{ verticalAlign: "center", textAlign: "center" }}
                                        key={-1}
                                    >
                                        <Typography
                                            style={{
                                                fontWeight: 500,
                                            }}
                                        >
                                            Actions
                                        </Typography>
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        {isLoading ? this.renderLoading() : this.renderData()}
                    </Table>
                </TableContainer>
                {/* pagiantion */}
                <Box className={classes.container}>
                    {entries ? (
                        <Typography
                            style={{
                                marginRight: "auto",
                                height: 36,
                                fontSize: 14,
                                color: "gray ",
                                alignItems: " center",
                                display: "flex"
                            }}
                        >
                            Showing {entries.from ?? 0} to {entries.to ?? 0} of {entries.total} entries
                        </Typography>
                    ) : undefined}
                    <Pagination
                        variant="outlined"
                        sx={{ marginLeft: "auto" }}
                        size={
                            this.props.width === "xs" || this.props.width === "sm"
                                ? "medium"
                                : "large"
                        }
                        shape="rounded"
                        count={count}
                        page={count > 0 ? parseInt(pagination.page) : 0}
                        onChange={this.handlePageChange}
                    />
                </Box>
            </div>
        );
    }
}

const materialStyles = (theme) => ({
    container: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        padding: "0rem 1rem"
    },
    preBorder: {
        backgroundColor: theme.palette.primary.main,
        zIndex: 1,
        left: 0,
        width: 10,
        height: 10,
        position: "absolute",
    },
    proBorder: {
        backgroundColor: theme.palette.primary.main,
        zIndex: 1,
        right: 0,
        width: 10,
        height: 10,
        position: "absolute",
    },
    root: {
        backgroundColor: "#fff",
        borderRadius: "0.5rem 0.5rem 0 0",
        overflow: "hidden",
        position: "relative",
    },
    head: {
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
        "& *": { color: "#fff" },
    },
    actionButtonContainers: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        "& > *": { marginRight: 8 },
        "& > :last-child": { marginRight: 0 },
    },
    tableInnerBody: {
        position: "relative",
        "& > tr:nth-child(3) > td": {
            position: "relative",
            zIndex: 2,
            backgroundColor: "#fff",
        },
        "& > tr:nth-child(3) td:first-child": {
            borderTopLeftRadius: "0.5rem",
            position: "relative",
            zIndex: 2,
        },
        "& > tr:nth-child(3) td:last-child": {
            borderTopRightRadius: "0.5rem",
            position: "relative",
            zIndex: 2,
        },
        "&  td": {
            backgroundColor: "#fff",
        },
        "&  td:first-child": {
            paddingLeft: "1.5rem",
        },
    },
});

export default withRouter(withStyles(materialStyles)(DataTable));  