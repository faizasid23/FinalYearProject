import { Chip } from "@mui/material";

export const getQueryParamParsed = (value) => {
    if (value === null || value === undefined || value === "") {
        return null;
    }
    return value;
};

export const LEAVE_STATUSES = [
    { value: 0, name: "Pending" },
    { value: 1, name: "Approve" },
    { value: 2, name: "Reject" },
];

export const renderStatus = (status) => {
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
            return <Chip label="Pending" className="pill-pending lgPill" />;
        case 1:
            return <Chip label="Approved" className="pill-success lgPill" />;
        case 2:
            return <Chip label="Rejected" className="pill-error lgPill" />;
        default:
            return <Chip label="Pending" className="pill-pending lgPill" />;
    }
}

export const PROGRAMS = [
    { code: 'AO1', name: 'Administrative Operations' },
    { code: 'BO1', name: 'Business Operations' },
    { code: 'PSW_01', name: 'Project Study Work' },
    { code: 'IPW_01', name: 'IP Team Work' },
    { code: 'SC_01', name: 'STS Chapter' }
] 