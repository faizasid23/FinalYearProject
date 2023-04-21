import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Alert, Grid, Snackbar, Typography } from '@mui/material'
import { withStyles } from '@mui/styles'
import { STUDENT_COLUMNS } from './columns'
// Our utility functions
import { withRouter } from '../../../../utils/router'
// Importing Our components
import DataTable from './../../../../components/Table';
import ActionItem from './../../../../components/ActionItem';
import Actions from './../../../../components/Actions';
import DangerModal from '../../../../components/DangerModal';
// import TimesheetDetailModal from './timesheetDetailModal';
import AddStudentModal from './addStudentModal';
import { getStudents, removeStudent } from '../../../../apis/manager'

export const Index = (props) => {

    let { classes, user } = props;

    const [data, setData] = useState([]);;
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [showAddStudentModal, setShowAddStudentModal] = useState(null);
    const [showToast, setShowToast] = useState(null);

    const getDataFromAPI = useCallback(async () => {
        // this.setState({ entries: null })
        setIsDataLoading(true)
        await getStudents(user?._id).then((result) => {
            if (result.status === "success") {
                setIsDataLoading(false)
                setData(result.data)
            } else {
                setIsDataLoading(false)
                setShowToast({
                    status: "error",
                    message: "Cannot get your students at the moment. Please try again later"
                })
            }
        });
    }, [user?._id])

    useEffect(() => {
        getDataFromAPI()
    }, [getDataFromAPI])

    const renderControls = (index) => {
        let item = data[index];
        return (
            <Actions>
                <ActionItem
                    text="Remove"
                    handleClick={() => setShowDeleteModal(item)}
                />
            </Actions>
        );
    };

    const handleStudentAdd = () => {
        if (showAddStudentModal._id === undefined) {
            setShowAddStudentModal(null)
            setShowToast({
                status: "success",
                message: "Student added successfully"
            })
            getDataFromAPI()
        } else {
            setShowAddStudentModal(null)
            setShowToast({
                status: "success",
                message: "Student updated successfully"
            })
            getDataFromAPI()
        }
    }

    const handleDelete = () => {

        let params = {
            student_id: showDeleteModal._id,
            manager_id: user?._id
        }

        let deletedItem = removeStudent(params).then((result) => {
            if (result.status === "success") {
                setShowDeleteModal(null)
                setShowToast({
                    status: "success",
                    message: "Student removed successfully"
                })
                getDataFromAPI();
                return true;
            } else {
                setShowToast({
                    status: "error",
                    message: result.message ?? "Cannot remove this student at the moment.",
                })
                return false;
            }
        });
        return deletedItem;
    }

    return (
        <div className={classes.page}>
            <div className={classes.header}>
                <div>
                    <Typography class={classes.title}>Students</Typography>
                </div>
                <Typography
                    class={classes.addBtn}
                    onClick={() => setShowAddStudentModal({})}
                >
                    Add Student
                </Typography>
            </div>
            <Grid container>
                {/* Main  start */}
                <Grid item xs={12}>
                    <div className={classes.mainContent}>
                        <div>
                            <div className={classes.bodyContent}>
                                <DataTable
                                    columns={STUDENT_COLUMNS}
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
                showAddStudentModal !== null && (
                    <AddStudentModal
                        id={user?._id}
                        handleClose={() => setShowAddStudentModal(null)}
                        handleSubmit={handleStudentAdd}
                    />
                )
            }
            {
                showDeleteModal !== null && (
                    <DangerModal
                        heading="Delete Confirmation"
                        message={`Are you sure you want to remove this student?`}
                        buttonText="Yes"
                        item={showDeleteModal}
                        handleCancel={() => setShowDeleteModal(null)}
                        handleSubmit={handleDelete}
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
        fontWeight: 500,
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