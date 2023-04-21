import { axios } from './axiosConfig'

// Dashboard APIs start
export const getStudents = (id) => {
    let data = axios
        .get(`manager/students/get-all/${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { data: [] };
        });
    return data;
};

export const getRecentHolidayRequests = () => {
    let data = axios
        .get(`manager/dashboard/student-holidays`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { data: [] };
        });
    return data;
};


export const getStudentActivity = () => {
    let data = axios
        .get(`manager/dashboard/student-timesheets`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { data: [] };
        });
    return data;
};


export const getActiveStudents = () => {
    let data = axios
        .get(`manager/dashboard/students`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { data: [] };
        });
    return data;
};
// Dashboard APIs end

export const getStudentById = (id) => {
    let data = axios
        .get(`manager/students/${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { data: [] };
        });
    return data;
};

export const selectStudent = (params) => {
    let data = axios.patch(`manager/students/assign`, params)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { data: [] };
        });
    return data;
};

export const removeStudent = (params) => {
    let data = axios.patch(`manager/students/remove`, params)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { data: [] };
        });
    return data;
};

// holidays APIs start
export const getHolidayRequests = (id) => {
    let data = axios
        .get(`manager/holidays/getHolidayRequests/${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { data: [] };
        });
    return data;
};

export const updateHolidayRequest = (id, params) => {
    let data = axios
        .patch(`manager/holidays/updateHolidayRequest/${id}`, params)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { data: [] };
        });
    return data;
};
// holidays APIs end

// Timesheets APIs start
export const getTimesheets = (id) => {
    let data = axios
        .get(`manager/timesheets/getTimesheets/${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { data: [] };
        });
    return data;
};

export const updateTimesheets = (id, params) => {
    let data = axios
        .patch(`manager/timesheets/updateTimesheets/${id}`, params)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { data: [] };
        });
    return data;
};
// Timesheets APIs end

// E Track start
export const getEffortTracking = (id) => {
    let data = axios
        .get(`manager/effort-tracking/getEffortData/${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { data: [] };
        });
    return data;
};

// export const updateTimesheets = (id, params) => {
//     let data = axios
//         .patch(`manager/timesheets/updateTimesheets/${id}`, params)
//         .then((res) => {
//             return res.data;
//         })
//         .catch((err) => {
//             return { data: [] };
//         });
//     return data;
// };
// E Track end