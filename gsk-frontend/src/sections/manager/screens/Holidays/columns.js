import { renderStatus } from "../../../../utils/common";
import moment from "moment";

export const HOLIDAY_COLUMNS = [
    {
        title: "Student Name",
        dbName: "name",
        render: (row) => {
            return <>{row.student_id?.name}</>
        }
    },
    {
        title: "Leave Type",
        dbName: "leave_type"
    },
    {
        title: "Date Applied",
        dbName: "date_applied",
        render: (row) => {
            return <>{moment(row.date_applied).format('MM/DD/YYYY')}</>
        }
    },
    {
        title: "Days",
        dbName: "days",
        render: (row) => {
            return <>{moment(row.end_date).diff(moment(row.start_date), 'days') + 1}</>
        }
    },
    {
        title: "Status",
        dbName: "status",
        render: (row) => { return renderStatus(row?.status) }
    }
];