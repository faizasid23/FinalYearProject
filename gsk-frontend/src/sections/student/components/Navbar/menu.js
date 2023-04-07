import { studentUrls } from '../../../../utils/urls';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShowChartIcon from '@mui/icons-material/ShowChart';

export const MENU = [
    {
        title: "Home",
        url: studentUrls.Dashboard,
        icon: <DashboardIcon />
    },
    {
        title: "Timesheets",
        url: studentUrls.Timesheets,
        icon: <ListAltIcon />,
    },
    {
        title: "Holidays",
        url: studentUrls.Holidays,
        icon: <CalendarMonthIcon />,
    },
    {
        title: "Effort Tracking",
        url: studentUrls.EffortTracking,
        icon: <ShowChartIcon />,
    }
];