import React, { useState, useEffect } from 'react'
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

export const Index = (props) => {

    let { classes, user } = props;

    const [showDetailModal, setShowDetailModal] = useState(null);
    const [showCreateEditModal, setShowCreateEditModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [data, setData] = useState([]);
    const [id, setId] = useState(null);

    useEffect(() => {
    }, [])

    const handleLeavesEditCreate = () => {

    }

    const handleDelete = () => {

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
                            handleClick={() => setShowDeleteModal(index)}
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
                    onClick={() => setShowCreateEditModal({})}
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
                                employee_name={user.name}
                                date_applied={item.created_at}
                                leave_date={item.leave_date}
                                end_date={item.end_date}
                                leave_type={item.leave_type?.name ?? "NA"}
                                reason={item.reason ?? ""}
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
                        id={id}
                        item={showCreateEditModal}
                        handleClose={() => setShowCreateEditModal(null)}
                        handleSubmit={handleLeavesEditCreate}
                    />
                )
            }
            {
                showDeleteModal !== null && (
                    <DangerModal
                        heading="Delete Confirmation"
                        message={` Are you sure you want to delete the leave application?`}
                        buttonText="Delete"
                        item={showDeleteModal}
                        handleCancel={setShowDeleteModal(null)}
                        handleSubmit={() => handleDelete(this.state.data[this.state.showDeleteModal])}
                    />
                )
            }
            {
                showDetailModal !== null && (
                    <LeaveApplicationDetailModal
                        name={showDetailModal?.student?.name}
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