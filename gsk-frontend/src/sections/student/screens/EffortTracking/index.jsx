import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { Alert, Snackbar, Grid, Typography } from '@mui/material'
import { withRouter } from '../../../../utils/router'
import { withStyles } from '@mui/styles'
import { EFFORT_TRACKING_COLUMNS } from './columns'
import Actions from '../../../../components/Actions'
import ActionItem from '../../../../components/ActionItem'
import DataTable from './../../../../components/Table/index';
import ActionsDropdown from '../../../../components/ActionsDropdown'
import DangerModal from '../../../../components/DangerModal'
import EditEffortModal from './editEffortModal'
// import EffortDetailModal from './effortDetailModal'
import { deleteEffortTracking, getEffortTracking } from '../../../../apis/student'
import clsx from 'clsx'

const MODE_ARRAY = [
    { name: 'Monthly', value: 'monthly', hours: '150' },
    { name: 'Weekly', value: 'weekly', hours: '37.5' },
    { name: 'Daily', value: 'daily', hours: '7.5' }
]

export const Index = (props) => {
    let { classes, user } = props;

    const [data, setData] = useState([]);
    const [mode, setMode] = useState("monthly");
    // const [showDetailModal, setShowDetailModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [showCreateEditModal, setShowCreateEditModal] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [showToast, setShowToast] = useState(null);

    const getDataFromAPI = useCallback(async () => {
        // this.setState({ entries: null })

        setIsDataLoading(true)
        await getEffortTracking(user?._id, `?mode=${mode}`).then((result) => {
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
    }, [user?._id, mode])

    useEffect(() => {
        getDataFromAPI()
    }, [getDataFromAPI])

    const handleEtrackEditCreate = () => {
        if (showCreateEditModal._id === undefined) {
            setShowCreateEditModal(null)
            setShowToast({
                status: "success",
                message: "Effort Data added successfully"
            })
            getDataFromAPI()
        } else {
            setShowCreateEditModal(null)
            setShowToast({
                status: "success",
                message: "Effort Data updated successfully"
            })
            getDataFromAPI()
        }
    }

    const handleDelete = () => {
        let deletedItem = deleteEffortTracking(showDeleteModal._id).then((result) => {
            if (result.status === "success") {
                setShowDeleteModal(null)
                setShowToast({
                    status: "success",
                    message: "Effort track removed successfully"
                })
                getDataFromAPI();
                return true;
            } else {
                setShowToast({
                    status: "error",
                    message: result.message ?? "Effort track deletion failed",
                })
                return false;
            }
        });
        return deletedItem;
    }

    const handleModeChange = (val) => {
        setMode(val)
        // getDataFromAPI()
    }


    const renderControls = (index) => {
        let item = data[index];
        return (
            <Actions>
                <ActionItem
                    text="Edit"
                    handleClick={() => setShowCreateEditModal(item)}
                />
                <ActionItem
                    text="Delete"
                    handleClick={() => setShowDeleteModal(item)}
                />
            </Actions>

        );
    };

    const renderViewMode = () => (
        <ActionsDropdown text={mode}>
            {MODE_ARRAY.map((item, index) =>
                <ActionItem
                    key={index}
                    text={item.name}
                    handleClick={() => handleModeChange(item.value)}
                />
            )}
        </ActionsDropdown>
    )

    return (
        <div className={classes.page}>
            <div className={classes.header}>
                <div>
                    <Typography class={classes.title}>Effort Tracking Record</Typography>
                </div>
                <div className={classes.flex}>
                    {renderViewMode()}
                    <Typography
                        class={classes.addBtn}
                        onClick={() => setShowCreateEditModal({})}
                    >
                        Log Effort
                    </Typography>
                </div>
            </div>
            <div className={classes.header}>
                <div></div>
                <div className={clsx(classes.flex, classes.hourHead)}>
                    <Typography>Hours Required : </Typography>
                    <Typography>{MODE_ARRAY.filter((d) => d.value === mode)[0].hours} hours</Typography>
                </div>

            </div>
            <Grid container>
                {/* Main  start */}
                <Grid item xs={12}>
                    <div className={classes.mainContent}>
                        <div>
                            <div className={classes.bodyContent}>
                                <DataTable
                                    columns={EFFORT_TRACKING_COLUMNS}
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
            {/* {showDetailModal !== null && (
                <EffortDetailModal
                    item={showDetailModal}
                    handleClose={() => setShowDetailModal(null)}
                />
            )} */}
            {showCreateEditModal !== null && (
                <EditEffortModal
                    mode={mode}
                    student_id={user?._id}
                    item={showCreateEditModal}
                    handleClose={() => setShowCreateEditModal(null)}
                    handleSubmit={handleEtrackEditCreate}
                />
            )}
            {showDeleteModal !== null && (
                <DangerModal
                    heading="Delete Confirmation"
                    message={`Are you sure you want to delete this E-tracking?`}
                    buttonText="Yes"
                    item={showDeleteModal}
                    handleCancel={() => setShowDeleteModal(null)}
                    handleSubmit={handleDelete}
                />
            )}
        </div>
    )
}

const materialStyles = (theme) => ({
    header: {
        display: "flex",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: "1.5rem"
    },
    flex: {
        display: 'flex'
    },
    hourHead: {
        "& p": { color: 'gray', padding: '0.25rem' }
    },
    title: {
        fontSize: "1.75rem",
        color: theme.palette.primary.main,
        fontWeight: 500
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
        cursor: "pointer",
        marginLeft: "1rem !important"
    }
});

const mapStateToProps = (state) => ({ user: state.user?.user })

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(materialStyles)(Index)));