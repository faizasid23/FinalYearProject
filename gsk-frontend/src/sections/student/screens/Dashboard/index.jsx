import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import DashboardCard from '../../../../components/Dashboard/DashboardCard';
import DashboardTable from '../../../../components/Dashboard/DashboardTable';
import CircularChart from './../../../../components/CircularChart/index';
import { studentUrls } from '../../../../utils/urls';
// icons and styles
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { withStyles } from "@mui/styles";
import { Grid, Skeleton, Typography } from '@mui/material';
import { latest_effort_tracking, latest_holidays, latest_timesheet } from './columns';
import { getDashboardData, getRecentEffortTracking, getRecentHolidays, getRecentTimesheet } from '../../../../apis/student';

export const Index = (props) => {
    const { classes } = props;
    const [loading, setIsLoading] = useState(true)
    const [dashboard, setDashboard] = useState({ holidays: null, timesheet: null, etrack: null });

    useEffect(() => {
        window.scrollTo(0, 0);
        getDashboardData().then((result) => {
            if (result.status === "success") {
                setDashboard(result.data)
                setIsLoading(false)
            }
        });
    }, [])

    const renderLoaderSkeleton = () => (
        <div>
            <div className={classes.flex}>
                <Skeleton variant="rectangular" width={372} height={130} />
                <Skeleton variant="rectangular" width={372} height={130} />
                <Skeleton variant="rectangular" width={372} height={130} />
            </div>
            <div className={classes.flex}>
                <Skeleton variant="rectangular" width={372} height={470} />
                <Skeleton variant="rectangular" width={372} height={470} />
                <Skeleton variant="rectangular" width={372} height={470} />
            </div>
        </div>
    );

    const renderCountArea = () => (
        <div className={classes.holidayBody}>
            <Typography>Available: {parseInt(28 - dashboard.holidays)} Day(s)</Typography>
            <CircularChart
                selectedValue={dashboard.holidays ?? 0}
                maxValue={28}
                strokeWidth="4"
                activeStrokeColor='#F36633'
                radius={40}
                valueFontSize='14'
            />
        </div>
    );

    return (
        <div className={classes.dashboardpage}>
            {loading ? renderLoaderSkeleton()
                :
                <Grid container spacing={3}>
                    <Grid item xs={4} md={4}>
                        <DashboardCard
                            title="Holidays"
                            count={renderCountArea}
                        />
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <DashboardCard
                            icon={<ListAltIcon htmlColor='black' />}
                            title="Timesheet"
                            count={`${dashboard.timesheet ?? 0.00} hours`}
                            backgroundColor="#EEEEF0"
                        />
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <DashboardCard
                            icon={<ShowChartIcon htmlColor='black' />}
                            title="Effort Tracking"
                            count={dashboard.etrack ? `${dashboard.etrack} hours` : "Not Logged Yet"}
                            backgroundColor="#EEEEF0"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DashboardTable
                            title="Recent Timesheet"
                            columns={latest_timesheet}
                            url={studentUrls.Timesheets}
                            urlText="View More"
                            emptyText="No Recent Timesheet Data"
                            emptyIcon={<ManageSearchIcon fontSize='large' />}
                            api={getRecentTimesheet}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DashboardTable
                            title="Recent Holidays"
                            columns={latest_holidays}
                            url={studentUrls.Holidays}
                            urlText="View More"
                            emptyText="No Recent Holidays"
                            emptyIcon={<ManageSearchIcon fontSize='large' />}
                            api={getRecentHolidays}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DashboardTable
                            title="Recent Effort Tracking"
                            columns={latest_effort_tracking}
                            url={studentUrls.EffortTracking}
                            urlText="View More"
                            emptyText="No Recent Effort Tracking"
                            emptyIcon={<ManageSearchIcon fontSize='large' />}
                            api={getRecentEffortTracking}
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
    },
    holidayBody: {
        display: "flex",
        alignItems: "center",
        marginBottom: "0.5rem",
        width: "100%",
        justifyContent: "space-between",
        "& p": {
            fontSize: '0.875rem !important', color: 'gray'
        },
        "& > svg": {
            marginBottom: '2.75rem'
        }
    }
});

const mapStateToProps = (state) => ({ user: state.user.user })

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(Index));