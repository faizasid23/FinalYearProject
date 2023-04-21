// import queryString from "query-string";
import { axios } from "./axiosConfig";

// Dashboard APIs Start

export const getDashboardData = () => {
    return axios.get("student/dashboard/data").then((result) => {
        return result.data;
    });
};

export const getRecentHolidays = () => {
    return axios.get("student/dashboard/recentHolidays").then((result) => {
        return result.data;
    });
};

export const getRecentTimesheet = () => {
    return axios.get("student/dashboard/recentTimesheet").then((result) => {
        return result.data;
    });
};

export const getRecentEffortTracking = () => {
    return axios.get("student/dashboard/recentEffortTracking").then((result) => {
        return result.data;
    });
};
// Dashboard APIs End

// Holidays APIs Start 
export const applyLeave = (data) => {
    let result = axios.post("student/holidays/addHoliday", data)
        .then((res) => {
            if (res.data.status === "success")
                return {
                    data: res.data.data,
                    status: "success",
                    message: "Leave applied successfully!",
                };
            else
                return {
                    status: "error",
                    errors: res.data.errors ?? null,
                    message: res.data.message ?? "Some issue occured!"
                };
        }).catch((err) => {
            return { status: "error", message: "Leave application failed!" };
        });
    return result;
};

export const getLeaves = (id) => {
    let data = axios
        .get(`student/holidays/getHoliday/${id}`)
        .then((res) => {
            let jobs = res.data;
            return jobs;
        })
        .catch((err) => {
            return { err };
        });
    return data;
};

export const deleteLeave = (id) => {
    let result = axios
        .delete(`student/holidays/deleteHoliday/${id}`)
        .then((res) => {
            if (res.data.status === "success") return res.data;
            else
                return {
                    status: "error",
                    errors: res.data.errors ?? null,
                    message: "Issue occured while removing!",
                };
        })
        .catch((err) => {
            return {
                status: "error",
                errors: {},
                message: "Issue occured while removing!",
            };
        });
    return result;
};

export const updateLeave = (data, id) => {
    let result = axios
        .patch(`student/holidays/updateHoliday/${id}`, data)
        .then((res) => {
            if (res.data.status === "success")
                return {
                    status: "success",
                    message: "Leave application updated successfully!",
                };
            else
                return {
                    status: "error",
                    errors: res.data.errors ?? null,
                    message: res.data.message ?? "Kindly fix the data!",
                };
        })
        .catch((err) => {
            return { status: "error", message: "Leave request failed!" };
        });
    return result;
};
// Holidays APIs End

// Timesheets APIs Start 
export const addTimesheet = (data) => {
    let result = axios.post("student/timesheet/addTimesheet", data)
        .then((res) => {
            if (res.data.status === "success")
                return {
                    data: res.data.data,
                    status: "success",
                    message: "Timesheet added successfully!",
                };
            else
                return {
                    status: "error",
                    errors: res.data.errors ?? null,
                    message: res.data.message ?? "Some issue occured!"
                };
        }).catch((err) => {
            return { status: "error", message: "Timesheet addition failed!" };
        });
    return result;
};

export const getTimesheet = (id, query) => {
    let data = axios
        .get(`student/timesheet/getTimesheet/${id}${query}`)
        .then((res) => {
            let jobs = res.data;
            return jobs;
        })
        .catch((err) => {
            return { err };
        });
    return data;
};

export const deleteTimesheet = (id) => {
    let result = axios
        .delete(`student/timesheet/deleteTimesheet/${id}`)
        .then((res) => {
            if (res.data.status === "success") return res.data;
            else
                return {
                    status: "error",
                    errors: res.data.errors ?? null,
                    message: "Issue occured while removing!",
                };
        })
        .catch((err) => {
            return {
                status: "error",
                errors: {},
                message: "Issue occured while removing!",
            };
        });
    return result;
};

export const updateTimesheet = (data, id) => {
    let result = axios
        .patch(`student/timesheet/updateTimesheet/${id}`, data)
        .then((res) => {
            if (res.data.status === "success")
                return {
                    status: "success",
                    message: "Timesheet updated successfully!",
                };
            else
                return {
                    status: "error",
                    errors: res.data.errors ?? null,
                    message: res.data.message ?? "Kindly fix the data!",
                };
        })
        .catch((err) => {
            return { status: "error", message: "Timesheet update request failed!" };
        });
    return result;
};
// Timesheets APIs End

// effort_tracking APIs Start 
export const addEffortTracking = (data) => {
    let result = axios.post("student/effort_tracking/addEffortTracking", data)
        .then((res) => {
            if (res.data.status === "success")
                return {
                    data: res.data.data,
                    status: "success",
                    message: "Effort Track added successfully!",
                };
            else
                return {
                    status: "error",
                    errors: res.data.errors ?? null,
                    message: res.data.message ?? "Some issue occured!"
                };
        }).catch((err) => {
            return { status: "error", message: "Effort Track addition failed!" };
        });
    return result;
};

export const getEffortTracking = (id, query) => {
    let data = axios
        .get(`student/effort_tracking/getEffortTracking/${id}${query}`)
        .then((res) => {
            let jobs = res.data;
            return jobs;
        })
        .catch((err) => {
            return { err };
        });
    return data;
};

export const deleteEffortTracking = (id) => {
    let result = axios
        .delete(`student/effort_tracking/deleteEffortTracking/${id}`)
        .then((res) => {
            if (res.data.status === "success") return res.data;
            else
                return {
                    status: "error",
                    errors: res.data.errors ?? null,
                    message: "Issue occured while removing!",
                };
        })
        .catch((err) => {
            return {
                status: "error",
                errors: {},
                message: "Issue occured while removing!",
            };
        });
    return result;
};

export const updateEffortTracking = (data, id) => {
    let result = axios
        .patch(`student/effort_tracking/updateEffortTracking/${id}`, data)
        .then((res) => {
            if (res.data.status === "success")
                return {
                    status: "success",
                    message: "Effort Track updated successfully!",
                };
            else
                return {
                    status: "error",
                    errors: res.data.errors ?? null,
                    message: res.data.message ?? "Kindly fix the data!",
                };
        })
        .catch((err) => {
            return { status: "error", message: "Effort Track update request failed!" };
        });
    return result;
};
// effort_tracking APIs End