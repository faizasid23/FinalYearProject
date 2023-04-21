import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import DashboardCard from '../../../../components/Dashboard/DashboardCard';
import DashboardTable from '../../../../components/Dashboard/DashboardTable';
import { managerUrls } from '../../../../utils/urls';
// icons and styles
import GroupIcon from '@mui/icons-material/Group';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { withStyles } from "@mui/styles";
import { Grid, Skeleton } from '@mui/material';
import { HOLIDAY_REQUESTS, STUDENTS_ACTIVITY, ACTIVE_STUDENTS } from './columns';
import { getStudents, getRecentHolidayRequests, getStudentActivity, getActiveStudents } from '../../../../apis/manager';

export const Index = (props) => {
    const { classes, user } = props;
    const [loading, setIsLoading] = useState(true)
    const [dashboard, setDashboard] = useState({ students: null });

    useEffect(() => {
        window.scrollTo(0, 0);
        getStudents(user?._id).then((result) => {
            if (result.status === "success") {
                setDashboard({ students: result.data?.length ?? null })
                setIsLoading(false)
            }
        });
    }, [user?._id])

    const renderLoaderSkeleton = () => (
        <div>
            <div className={classes.flex}>
                <Skeleton variant="rectangular" width={372} height={130} />
            </div>
            <div className={classes.flex}>
                <Skeleton variant="rectangular" width={372} height={470} />
                <Skeleton variant="rectangular" width={372} height={470} />
                <Skeleton variant="rectangular" width={372} height={470} />
            </div>
        </div>
    );

    return (
        <div className={classes.dashboardpage}>
            {loading ? renderLoaderSkeleton()
                :
                <Grid container spacing={3}>
                    <Grid item md={4}>
                        <DashboardCard
                            icon={<GroupIcon htmlColor='black' />}
                            title="Your Students"
                            count={`${dashboard.students ?? 0}`}
                            backgroundColor="#EEEEF0"
                        />
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}></Grid>
                    <Grid item xs={12} md={4}>
                        <DashboardTable
                            title="Holiday Requests"
                            columns={HOLIDAY_REQUESTS}
                            url={managerUrls.Holidays}
                            urlText="View More"
                            emptyText="No Holiday Requests"
                            emptyIcon={<ManageSearchIcon fontSize='large' />}
                            api={getRecentHolidayRequests}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DashboardTable
                            title="Students Activity"
                            columns={STUDENTS_ACTIVITY}
                            url={managerUrls.Timesheets}
                            urlText="View More"
                            emptyText="No Students Activity"
                            emptyIcon={<ManageSearchIcon fontSize='large' />}
                            api={getStudentActivity}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DashboardTable
                            title="Active Students"
                            columns={ACTIVE_STUDENTS}
                            url={managerUrls.Students}
                            urlText="View More"
                            emptyText="No Active Students"
                            emptyIcon={<ManageSearchIcon fontSize='large' />}
                            api={getActiveStudents}
                        />
                    </Grid>
                </Grid>
            }
        </div>
    )
}

const materialStyles = (theme) => ({
    dashboardpage: {
        paddingTop: "2.75rem",
        paddingBottom: "2.75rem",
        maxWidth: "100%"
    },
    flex: {
        display: 'flex',
        marginBottom: '1.5rem',
        "& > *": { marginRight: "1.25rem", borderRadius: "0.425rem" }
    }
});

const mapStateToProps = (state) => ({ user: state.user.user })

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(Index));