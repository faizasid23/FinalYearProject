
import { renderHolidayStatus } from "../../../../utils/common";

export const latest_holidays = [
    {
        title: "Type",
        dbName: "category",
        // render: (row) => {
        //     return row?.employer_applied_job?.employer_job?.job_title?.name;
        // },
    },
    {
        title: "Date",
        dbName: "date",
        // render: (row) => {
        //     return row?.employer_applied_job?.employer_job?.job_title?.name;
        // },
    },
    {
        title: "Status",
        dbName: "status",
        render: (row) => { return renderHolidayStatus(row?.status) }
    }
];