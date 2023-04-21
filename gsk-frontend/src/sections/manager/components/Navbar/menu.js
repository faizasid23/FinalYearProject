import { managerUrls } from '../../../../utils/urls';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GroupIcon from '@mui/icons-material/Group';
export const MENU = [
    {
        title: "Home",
        url: managerUrls.Dashboard,
        icon: <DashboardIcon />
    },
    {
        title: "Students",
        url: managerUrls.Students,
        icon: <GroupIcon />,
    },
    {
        title: "Timesheets",
        url: managerUrls.Timesheets,
        icon: <ListAltIcon />,
    },
    {
        title: "Holiday Requests",
        url: managerUrls.Holidays,
        icon: <CalendarMonthIcon />,
    },
    {
        title: "Effort Tracking",
        url: managerUrls.EffortTracking,
        icon: <ShowChartIcon />,
    }
];