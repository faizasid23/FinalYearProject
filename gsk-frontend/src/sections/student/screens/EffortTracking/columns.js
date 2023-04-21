import { Chip } from "@mui/material";

export const EFFORT_TRACKING_COLUMNS = [
    {
        title: "Project Code",
        dbName: "project_code"
    },
    {
        title: "Project Name",
        dbName: "project_name"
    },
    {
        title: "Hours Logged",
        dbName: "hours",
        render: (row) => { return <>{row.hours} hours</> }
    },
    {
        title: "Time Period",
        dbName: "hours_against"
    },
    {
        title: "Status",
        dbName: "status",
        render: (row) => {
            return <Chip label="Submitted" className="pill-success" />
        }
    }
];