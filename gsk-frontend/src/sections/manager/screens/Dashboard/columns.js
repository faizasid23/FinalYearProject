import { renderStatus } from "../../../../utils/common";
import { Chip } from "@mui/material";

export const HOLIDAY_REQUESTS = [
    {
        title: "Student",
        dbName: "name",
        render: (row) => { return row.student_id?.name }
    },
    {
        title: "Leave",
        dbName: "leave_type"
    },
    {
        title: "Status",
        dbName: "status",
        render: (row) => { return renderStatus(row?.status) }
    }
];

export const STUDENTS_ACTIVITY = [
    {
        title: "Student",
        dbName: "name",
        render: (row) => { return row.student_id?.name }
    },
    {
        title: "Checkin / Checkout",
        dbName: "checkin_checkout",
        render: (row) => { return <>{row.checkin} - {row.checkout}</>; }
    },
    {
        title: "Status",
        dbName: "status",
        render: (row) => { return renderStatus(row?.status) }
    }
];

export const ACTIVE_STUDENTS = [
    {
        title: "Student",
        dbName: "name"
    },
    {
        title: "Status",
        dbName: "status",
        render: (row) => { return <Chip label="Active" className="pill-success" /> }
    }
];