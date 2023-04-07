import React from 'react'
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
import { Grid, Typography } from '@mui/material';
import { latest_holidays } from './columns';

export const Index = (props) => {
    const { classes } = props;

    const renderCountArea = () => {
        return (
            <div className={classes.holidayBody}>
                <Typography>Available: 18 Day(s)</Typography>
                <CircularChart
                    selectedValue={10}
                    maxValue={28}
                    strokeWidth="4"
                    activeStrokeColor='#F36633'
                    radius={40}
                    valueFontSize='14'
                />
            </div>
        )
    }

    return (
        <div className={classes.dashboardpage}>
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
                        count={"44 hours"}
                        backgroundColor="#EEEEF0"
                    />
                </Grid>
                <Grid item xs={4} md={4}>
                    <DashboardCard
                        icon={<ShowChartIcon htmlColor='black' />}
                        title="Effort Tracking"
                        count={"Not Logged Yet"}
                        backgroundColor="#EEEEF0"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <DashboardTable
                        title="Recent Timesheet"
                        columns={latest_holidays}
                        url={studentUrls.Holidays}
                        urlText="View More"
                        emptyText="No Recent Timesheet Data"
                        emptyIcon={<ManageSearchIcon fontSize='large'/>}
                    // api={getRecentJobOffers}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <DashboardTable
                        title="Recent Holidays"
                        columns={latest_holidays}
                        url={studentUrls.Holidays}
                        urlText="View More"
                        emptyText="No Recent Holidays"
                        emptyIcon={<ManageSearchIcon fontSize='large'/>}
                    // api={getRecentJobOffers}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <DashboardTable
                        title="Recent Effort Tracking"
                        columns={latest_holidays}
                        url={studentUrls.Holidays}
                        urlText="View More"
                        emptyText="No Recent Effort Tracking"
                        emptyIcon={<ManageSearchIcon fontSize='large'/>}
                    // api={getRecentJobOffers}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

const materialStyles = (theme) => ({
    dashboardpage: {
        paddingTop: "2.75rem",
        paddingBottom: "2.75rem",
        maxWidth: "100%"
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