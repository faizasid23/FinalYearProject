
import moment from "moment";
import { renderStatus } from "../../../../utils/common";

export const latest_holidays = [
    {
        title: "Leave Type",
        dbName: "leave_type"
    },
    {
        title: "Date Applied",
        dbName: "date_applied",
        render: (row) => {
            return moment(row?.date_applied).format('MM/DD/YYYY');
        },
    },
    {
        title: "Status",
        dbName: "status",
        render: (row) => { return renderStatus(row?.status) }
    }
];

export const latest_timesheet = [
    {
        title: "Date",
        dbName: "date",
        render: (row) => {
            return moment(row?.date).format('MM/DD/YYYY');
        },
    },
    {
        title: "Earned",
        dbName: "student_earned_amount",
        render: (row) => { return <>£{row.student_earned_amount}</>; }
    },
    {
        title: "Status",
        dbName: "status",
        render: (row) => { return renderStatus(row?.status) }
    }
];

export const latest_effort_tracking = [
    {
        title: "Program Code",
        dbName: "project_code"
    },
    {
        title: "hours",
        dbName: "hours"
    },
    {
        title: "Status",
        dbName: "status",
        render: (row) => { return renderStatus(row?.status) }
    }
];