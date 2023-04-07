import { Chip } from "@mui/material";

export const LEAVE_STATUSES = [
    { value: 0, name: "Pending" },
    { value: 1, name: "Approved" },
    { value: 2, name: "Rejected" },
];

export const renderHolidayStatus = (status) => {
    switch (status) {
        case 0:
            return <Chip label="Pending" className="pill-pending" />;
        case 1:
            return <Chip label="Approved" className="pill-success" />;
        case 2:
            return <Chip label="Rejected" className="pill-error" />;
        default:
            return <Chip label="Pending" className="pill-pending" />;
    }
}

export const renderStatusPill = (status) => {
    switch (status) {
        case 0:
            return <Chip label="Pending" className="pill-pending" />;
        case 1:
            return <Chip label="Accepted" className="pill-success" />;
        case 2:
            return <Chip label="Rejected" className="pill-error" />;
        default:
            return <Chip label="Pending" className="pill-pending" />;
    }
}