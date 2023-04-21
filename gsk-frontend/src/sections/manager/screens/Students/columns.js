import { Chip } from "@mui/material";

export const STUDENT_COLUMNS = [
    {
        title: "MUDID",
        dbName: "mudid"
    },
    {
        title: "First Name",
        dbName: "first_name"
    },
    {
        title: "Last Name",
        dbName: "last_name"
    },
    {
        title: "Email",
        dbName: "email",

    },
    {
        title: "Status",
        dbName: "status",
        render: (row) => { return <Chip label="Active" className="pill-success" /> }
    }
];