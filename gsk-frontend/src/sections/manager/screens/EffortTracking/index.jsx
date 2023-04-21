import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@mui/styles';
import { Alert, Snackbar, Typography } from '@mui/material';
// importing the constants from the utility functions created by us
import { withRouter } from '../../../../utils/router'
// Divided the modals for this screen into components placed in same folder 
import DataTable from '../../../../components/Table';
import { EFFORT_TRACKING_COLUMNS } from './columns';
// API call URLs
import { getEffortTracking } from '../../../../apis/manager';

export const Index = (props) => {

    let { classes, user } = props;

    // const [showDetailModal, setShowDetailModal] = useState(null);
    // const [showCreateEditModal, setShowCreateEditModal] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [data, setData] = useState([]);

    const getDataFromAPI = useCallback(() => {
        setIsDataLoading(true);
        getEffortTracking(user?._id).then((result) => {
            if (result.status === "success") {
                setIsDataLoading(false)
                setData(result.data)
            } else {
                setIsDataLoading(false)
                setShowToast({
                    status: "error",
                    message: "Cannot get the effort data at the moment. Please try again later"
                })
            }
        }).catch(() => {
            setIsDataLoading(false)
            setShowToast({
                status: "error",
                message: "Cannot get the effort data at the moment. Please try again later"
            })
        });
    }, [user?._id]);

    useEffect(() => {
        window.scrollTo(0, 0);
        getDataFromAPI();
    }, [getDataFromAPI])

    return (
        <div className={classes.page}>
            <div className={classes.header}>
                <div>
                    <Typography class={classes.title}>Students Effort Tracking Record</Typography>
                </div>
            </div>
            <div>
                <DataTable
                    columns={EFFORT_TRACKING_COLUMNS}
                    // entries={entries}
                    data={data}
                    // count={count}
                    isLoading={isDataLoading}
                    // renderControls={undefined}
                    getDataFromAPI={getDataFromAPI}
                />
            </div>
            {
                showToast !== null && (
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
                )
            }
            {/* render modals */}
            {/* {
                showDetailModal !== null && (
                    <TimesheetDetailModal
                        role="manager"
                        item={showDetailModal}
                        handleClose={() => setShowDetailModal(null)}
                    />
                )
            } */}
        </div >
    )
}

const materialStyles = (theme) => ({
    page: {
        paddingTop: "2.75rem",
        paddingBottom: "2.75rem",
        "& p": { margin: 0 }
    },
    header: {
        display: "flex",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: "1.25rem"
    },
    title: {
        fontSize: "1.75rem",
        color: theme.palette.primary.main,
        fontWeight: 500
    },
    loader: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
        width: "100%",
        borderRadius: "0.5rem",
        position: "relative",
        zIndex: 10,
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