import moment from "moment";
import { renderStatus} from "../../../../utils/common";

export const TIMESHEET_COLUMNS = [
    {
        title: "Date",
        dbName: "date",
        render: (row) => { return <>{moment(row?.date).format('MM/DD/YYYY')}</> }
    },
    {
        title: "Check in",
        dbName: "checkin"
    },
    {
        title: "Check out",
        dbName: "checkout"
    },
    {
        title: "Hours",
        dbName: "hours",

    },
    {
        title: "Amount Earned",
        dbName: "student_earned_amount",
        render: (row) => { return <>£{row.student_earned_amount}</> }
    },
    {
        title: "Status",
        dbName: "status",
        render: (row) => { return renderStatus(row.status) }
    }
];