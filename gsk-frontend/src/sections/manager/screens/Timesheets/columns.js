import { renderStatus } from "../../../../utils/common";
import moment from "moment";

export const TIMESHEETS_COLUMNS = [
    {
        title: "Student Name",
        dbName: "name",
        render: (row) => {
            return <>{row.student_id?.name}</>
        }
    },
    {
        title: "Date",
        dbName: "date",
        render: (row) => {
            return <>{moment(row.date).format('MM/DD/YYYY')}</>
        }
    },
    {
        title: "Checkin",
        dbName: "checkin",

    },
    {
        title: "Checkout",
        dbName: "checkout",
        // render: (row) => {
        //     return <>{moment(row.checkout).format('MM/DD/YYYY')}</>
        // }
    },
    {
        title: "Hours Logged",
        dbName: "hours",
        // render: (row) => {
        //     return <>{moment(row.checkout).format('MM/DD/YYYY')}</>
        // }
    },
    {
        title: "Status",
        dbName: "status",
        render: (row) => { return renderStatus(row?.status) }
    }
];