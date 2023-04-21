import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@mui/styles';
import { Alert, CircularProgress, Snackbar, Typography } from '@mui/material';
// importing the constants from the utility functions created by us
import { withRouter } from '../../../../utils/router'
import { renderStatusPill } from '../../../../utils/common';
import ActionsDropdown from '../../../../components/ActionsDropdown';
import ActionItem from '../../../../components/ActionItem';
import DangerModal from '../../../../components/DangerModal';
import LeaveCard from '../../components/Cards/LeaveCard';
// Divided the modals for this screen into components placed in same folder 
import LeaveApplicationDetailModal from './leaveApplicationDetailModal';
import EditLeaveModal from './editLeaveModal';
import NoDataPlaceholder from '../../../../components/NoDataPlaceholder';
// API call URLs
import { deleteLeave, getLeaves } from '../../../../apis/student';

export const Index = (props) => {

    let { classes, user } = props;

    const [showDetailModal, setShowDetailModal] = useState(null);
    const [showCreateEditModal, setShowCreateEditModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [data, setData] = useState([]);

    const getDataFromAPI = useCallback(() => {
        setIsDataLoading(true);
        getLeaves(user?._id).then((result) => {
            if (result.status === "success") {
                setIsDataLoading(false)
                setData(result.data)
            } else {
                setIsDataLoading(false)
                setShowToast({
                    status: "error",
                    message: "Cannot get the leaves data at the moment. Please try again later"
                })
            }
        }).catch((error) => {
            setIsDataLoading(false)
            setShowToast({
                status: "error",
                message: "Cannot get the leaves data at the moment. Please try again later"
            })
        });
    }, [user?._id]);

    useEffect(() => {
        window.scrollTo(0, 0);
        getDataFromAPI();
    }, [getDataFromAPI])


    const handleLeavesEditCreate = () => {
        if (showCreateEditModal._id === undefined) {
            setShowCreateEditModal(null)
            setShowToast({
                status: "success",
                message: "Leave applied successfully"
            })
            getDataFromAPI()
        } else {
            setShowCreateEditModal(null)
            setShowToast({
                status: "success",
                message: "Leave application updated successfully"
            })
            getDataFromAPI()
        }
    }

    const handleDelete = () => {
        let deletedItem = deleteLeave(showDeleteModal._id).then((result) => {
            if (result.status === "success") {
                setShowDeleteModal(null)
                setShowToast({
                    status: "success",
                    message: "Leave withdrawn successfully"
                })
                getDataFromAPI();
                return true;
            } else {
                setShowToast({
                    status: "error",
                    message: result.message ?? "Leave withdraw failed",
                })
                return false;
            }
        });
        return deletedItem;
    }

    const renderActions = (index) => {
        let item = data[index];
        return (
            <ActionsDropdown>
                <ActionItem
                    text="Details"
                    handleClick={() => setShowDetailModal(data[index])}
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
            </ActionsDropdown>
        );
    };

    return (
        <div className={classes.page}>
            <div className={classes.header}>
                <div>
                    <Typography class={classes.title}>Leaves</Typography>
                </div>
                <Typography
                    class={classes.addBtn}
                    onClick={() => setShowCreateEditModal({ student_id: user?._id })}
                >
                    Apply Leave
                </Typography>
            </div>
            <div>
                {isDataLoading ? (
                    <div className={classes.loader}>
                        <CircularProgress />
                    </div>
                ) : data?.length > 0 ? (
                    <>
                        {data.map((item, index) => (
                            <LeaveCard
                                key={index}
                                employee_name={user.name}
                                date_applied={item.date_applied}
                                start_date={item.start_date}
                                end_date={item.end_date}
                                leave_type={item.leave_type}
                                reason={item.reason}
                                status={renderStatusPill(item.status)}
                                renderControls={() => renderActions(index)}
                            />
                        ))}
                    </>
                ) : (
                    <NoDataPlaceholder> No records found </NoDataPlaceholder>
                )}
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
                        role='student'
                        leave={showCreateEditModal}
                        handleClose={() => setShowCreateEditModal(null)}
                        handleSubmit={handleLeavesEditCreate}
                    />
                )
            }
            {
                showDeleteModal !== null && (
                    <DangerModal
                        heading="Delete Confirmation"
                        message={`Are you sure you want to delete this leave application?`}
                        buttonText="Yes"
                        item={showDeleteModal}
                        handleCancel={() => setShowDeleteModal(null)}
                        handleSubmit={handleDelete}
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