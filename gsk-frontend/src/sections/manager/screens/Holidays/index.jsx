import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@mui/styles';
import { Alert, Snackbar, Typography } from '@mui/material';
// importing the constants from the utility functions created by us
import { withRouter } from '../../../../utils/router'
import Actions from '../../../../components/Actions';
import ActionItem from '../../../../components/ActionItem';
// Divided the modals for this screen into components placed in same folder 
import LeaveApplicationDetailModal from '../../../student/screens/Holidays/leaveApplicationDetailModal';
import EditLeaveModal from '../../../student/screens/Holidays/editLeaveModal';
import DataTable from './../../../../components/Table';
import { HOLIDAY_COLUMNS } from './columns';
// API call URLs
import { getHolidayRequests } from '../../../../apis/manager';

export const Index = (props) => {

    let { classes, user } = props;

    const [showDetailModal, setShowDetailModal] = useState(null);
    const [showCreateEditModal, setShowCreateEditModal] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [data, setData] = useState([]);

    const getDataFromAPI = useCallback(() => {
        setIsDataLoading(true);
        getHolidayRequests(user?._id).then((result) => {
            if (result.status === "success") {
                setIsDataLoading(false)
                setData(result.data)
            } else {
                setIsDataLoading(false)
                setShowToast({
                    status: "error",
                    message: "Cannot get the holidays at the moment. Please try again later"
                })
            }
        }).catch((error) => {
            setIsDataLoading(false)
            setShowToast({
                status: "error",
                message: "Cannot get the holidays data at the moment. Please try again later"
            })
        });
    }, [user?._id]);

    useEffect(() => {
        window.scrollTo(0, 0);
        getDataFromAPI();
    }, [getDataFromAPI])


    const handleLeavesEditCreate = () => {
        setShowCreateEditModal(null)
        setShowToast({
            status: "success",
            message: "Leave request updated successfully"
        })
        getDataFromAPI()
    }

    const renderActions = (index) => {
        let item = data[index];
        return (
            <Actions>
                <ActionItem
                    text="Details"
                    handleClick={() => setShowDetailModal(item)}
                />
                {item.status !== 1 && (
                    <ActionItem
                        text="Approve / Reject"
                        handleClick={() => setShowCreateEditModal(item)}
                    />
                )}
            </Actions>
        );
    };

    return (
        <div className={classes.page}>
            <div className={classes.header}>
                <div>
                    <Typography class={classes.title}>Holiday Requests</Typography>
                </div>
            </div>
            <div>
                <DataTable
                    columns={HOLIDAY_COLUMNS}
                    // entries={entries}
                    data={data}
                    // count={count}
                    isLoading={isDataLoading}
                    renderControls={renderActions}
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
            {
                showCreateEditModal !== null && (
                    <EditLeaveModal
                        leave={showCreateEditModal}
                        handleClose={() => setShowCreateEditModal(null)}
                        handleSubmit={handleLeavesEditCreate}
                    />
                )
            }
            {
                showDetailModal !== null && (
                    <LeaveApplicationDetailModal
                        item={showDetailModal}
                        handleClose={() => setShowDetailModal(null)}
                    />
                )
            }
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