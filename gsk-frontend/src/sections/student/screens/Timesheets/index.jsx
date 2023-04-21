import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import cloneDeep from 'lodash.clonedeep'
import queryString from 'query-string';
import { Alert, Grid, Snackbar, Typography } from '@mui/material'
import { withStyles } from '@mui/styles'
import { TIMESHEET_COLUMNS } from './columns'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
// Our utility functions
import { withRouter } from '../../../../utils/router'
import { getQueryParamParsed } from '../../../../utils/common'
// Importing Our components
import DataTable from './../../../../components/Table';
import ActionItem from './../../../../components/ActionItem';
import Actions from './../../../../components/Actions';
import { runValidator } from './../../../../utils/validations';
import Filter from '../../../../components/Filter';
import DangerModal from '../../../../components/DangerModal';
import TimesheetDetailModal from './timesheetDetailModal';
import EditTimesheetModal from './editTimesheetModal';
import { deleteTimesheet, getTimesheet } from '../../../../apis/student';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

export const Index = (props) => {

    let { classes, user } = props;

    const FILTER_INPUTS = {
        from_date: {
            rules: { required: true, date: true, maxDate: moment().add(1, 'd') },
            errorMessage: "Provide a start date. "
        },
        to_date: {
            rules: { required: true, date: true, maxDate: moment().add(1, 'd') },
            errorMessage: "Provide an end date. "
        }
    }

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [showCreateEditModal, setShowCreateEditModal] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const [filters, setFilters] = useState({
        from_date: null,
        to_date: null
    });

    const getDataFromAPI = useCallback(async () => {
        // this.setState({ entries: null })
        setIsDataLoading(true)
        await getTimesheet(user?._id, props.location.search).then((result) => {
            if (result.status === "success") {
                setIsDataLoading(false)
                setData(result.data)
            } else {
                setIsDataLoading(false)
                setShowToast({
                    status: "error",
                    message: "Cannot get the timesheets data at the moment. Please try again later"
                })
            }
        });
    }, [props.location.search, user?._id])

    useEffect(() => {
        getDataFromAPI()
    }, [getDataFromAPI])

    useEffect(() => {
        if (props.location.search !== "") {
            const queryParams = queryString.parse(props.location.search);

            if (queryParams.from_date) setFilters(prev => ({ ...prev, from_date: dayjs(queryParams.from_date) }))
            if (queryParams.to_date) setFilters(prev => ({ ...prev, to_date: dayjs(queryParams.to_date) }))
        }
    }, [props.location.search])

    const clearErrorIfExists = (name) => {
        if (errors[name]) {
            let uppdatedErrors = cloneDeep(errors);
            delete uppdatedErrors[name];
            setErrors(uppdatedErrors)
        }
    };

    const handleDateChange = (name, date) => {
        let isError = false;
        switch (name) {
            case "from_date":
                clearErrorIfExists("to_date")
                if (dayjs(date).isAfter(dayjs(filters.to_date))) {
                    isError = true;
                    setErrors({ [name]: "Start date can't be greater than end date. " })
                }
                break;
            case "to_date":
                clearErrorIfExists("from_date")
                if (dayjs(filters.from_date).isAfter(dayjs(date))) {
                    isError = true;
                    setErrors({ [name]: "End date can't be lesser than start date. " });
                }
                break;
            default:
                break;
        }
        setFilters(prev => ({ ...prev, [name]: date }))
        if (isError === false) clearErrorIfExists(name);
    }

    const validateAll = () => {
        let _errors = cloneDeep(errors);
        for (let field in FILTER_INPUTS) {
            let fieldErrors = runValidator(filters[field], FILTER_INPUTS[field]);
            if (fieldErrors.length > 0) _errors[field] = fieldErrors;
        }
        return _errors;
    };

    const handleFiltersChange = (e) => {
        if (e !== undefined) e.preventDefault();

        let errors = validateAll();

        if (Object.keys(errors).length !== 0) setErrors(errors);
        else {
            let queryParams = queryString.parse(props.location.search);

            delete queryParams.from_date;
            delete queryParams.to_date;
            queryParams.from_date = getQueryParamParsed(filters.from_date?.format("YYYY-MM-DD"));
            queryParams.to_date = getQueryParamParsed(filters.to_date?.format("YYYY-MM-DD"));

            navigate({
                pathname: window.location.pathname,
                search: `?${queryString.stringify(queryParams)}`
            })
            // getDataFromAPI();
        }
    };

    const handleFiltersClear = async () => {
        const queryParams = queryString.parse(props.location.search);
        delete queryParams.from_date;
        delete queryParams.to_date;
        await props.history(
            `${window.location.pathname}?${queryString.stringify(queryParams, {
                skipNull: true,
                skipEmptyStrings: true,
            })}`
        );

        setFilters({ from_date: null, to_date: null })
        setErrors({})
        // getDataFromAPI()
    };

    const renderFilterInputs = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                    <DatePicker
                        disableFuture
                        label="From Date"
                        inputVariant="outlined"
                        format="MM/DD/YYYY"
                        value={filters.from_date}
                        onChange={(value) => handleDateChange("from_date", value)}
                        slotProps={{
                            textField: {
                                error: errors?.from_date ? true : false,
                                helperText: errors?.from_date
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <DatePicker
                        disableFuture
                        label="To Date"
                        inputVariant="outlined"
                        format="MM/DD/YYYY"
                        value={filters.to_date}
                        onChange={(value) => handleDateChange("to_date", value)}
                        slotProps={{
                            textField: {
                                error: errors?.to_date ? true : false,
                                helperText: errors?.to_date
                            }
                        }}
                    />
                </Grid>
            </Grid>
        );
    };

    const renderControls = (index) => {
        let item = data[index];
        return (
            <Actions>
                <ActionItem
                    text="Details"
                    handleClick={() => setShowDetailModal(item)}
                />
                {item.status === 0 && (
                    <>
                        <ActionItem
                            text="Edit"
                            handleClick={() => setShowCreateEditModal(data[index])}
                        />
                        <ActionItem
                            text="Delete"
                            handleClick={() => setShowDeleteModal(data[index])}
                        />
                    </>
                )}
            </Actions>
        );
    };

    const renderAddBtn = () => (
        <Typography
            class={classes.addBtn}
            onClick={() => setShowCreateEditModal({})}
        >
            Add Timesheet
        </Typography>
    )

    const handleTimesheetEditCreate = () => {
        if (showCreateEditModal._id === undefined) {
            setShowCreateEditModal(null)
            setShowToast({
                status: "success",
                message: "Timesheet added successfully"
            })
            getDataFromAPI()
        } else {
            setShowCreateEditModal(null)
            setShowToast({
                status: "success",
                message: "Timesheet updated successfully"
            })
            getDataFromAPI()
        }
    }

    const handleDelete = () => {
        let deletedItem = deleteTimesheet(showDeleteModal._id).then((result) => {
            if (result.status === "success") {
                setShowDeleteModal(null)
                setShowToast({
                    status: "success",
                    message: "Timesheet deleted successfully"
                })
                getDataFromAPI();
                return true;
            } else {
                setShowToast({
                    status: "error",
                    message: result.message ?? "Timesheet deletion failed",
                })
                return false;
            }
        });
        return deletedItem;
    }

    return (
        <div className={classes.page}>
            <div style={{ marginBottom: "1.25rem" }}>
                <Filter
                    filterBtn="show"
                    onChange={handleFiltersChange}
                    onClear={handleFiltersClear}
                    renderFilterInputs={renderFilterInputs}
                    leftSideComponent={<Typography class={classes.title}>Timesheets</Typography>}
                    rightSideComponent={renderAddBtn()}
                />
            </div>
            <Grid container>
                {/* Main  start */}
                <Grid item xs={12}>
                    <div className={classes.mainContent}>
                        <div>
                            <div className={classes.bodyContent}>
                                <DataTable
                                    columns={TIMESHEET_COLUMNS}
                                    // entries={entries}
                                    data={data}
                                    // count={count}
                                    isLoading={isDataLoading}
                                    renderControls={renderControls}
                                    getDataFromAPI={getDataFromAPI}
                                />
                            </div>
                        </div>
                    </div>
                </Grid>
                {/* Main  end */}
            </Grid>
            {showToast !== null && (
                <Snackbar
                    open={showToast !== null}
                    autoHideDuration={3000}
                    onClose={() => setShowToast(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                >
                    <Alert
                        variant="standard"
                        onClose={() => setShowToast(null)}
                        severity={showToast.status}
                    >
                        {showToast.message}
                    </Alert>
                </Snackbar>
            )}
            {/* render modals */}
            {showDetailModal !== null && (
                <TimesheetDetailModal
                    // role="student"
                    // name={user?.name}
                    item={showDetailModal}
                    handleClose={() => setShowDetailModal(null)}
                />
            )}
            {
                showCreateEditModal !== null && (
                    <EditTimesheetModal
                        student_id={user?._id}
                        item={showCreateEditModal}
                        handleClose={() => setShowCreateEditModal(null)}
                        handleSubmit={handleTimesheetEditCreate}
                    />
                )
            }
            {
                showDeleteModal !== null && (
                    <DangerModal
                        heading="Delete Confirmation"
                        message={`Are you sure you want to delete this timesheet?`}
                        buttonText="Yes"
                        item={showDeleteModal}
                        handleCancel={() => setShowDeleteModal(null)}
                        handleSubmit={handleDelete}
                    />
                )
            }
        </div>
    )
}

const materialStyles = (theme) => ({
    title: {
        fontSize: "1.75rem",
        color: theme.palette.primary.main,
        fontWeight: 500,
        alignSelf: "center"
    },
    page: {
        paddingTop: "2.75rem",
        paddingBottom: "2.75rem",
        "& p": { margin: 0 }
    },
    bodyContent: {
        backgroundColor: "#fff",
        position: "relative",
        zIndex: 10,
        paddingBottom: "1rem"
    },
    addBtn: {
        height: "3rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 1rem",
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
        borderRadius: "0.3125rem",
        cursor: "pointer"
    }
});

const mapStateToProps = (state) => ({ user: state.user?.user })

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(materialStyles)(Index)));