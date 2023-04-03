// importing our overridden axios settings
import { axios } from "./axiosConfig";

export const validateToken = (role, data) => {
    let result = axios
        .get(`${role}/validate-token`, {
            headers: {
                Authorization: "Bearer " + data,
            },
        })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return { status: "error", message: "Some issue occured" };
        });
    return result;
};

export const loginStudent = (data) => {
    let result = axios
        .post(`student/login`, data)
        .then((res) => {
            if (res.data.status === "success") {
                return {
                    status: "success",
                    data: res.data.data,
                    message: "Student logged successfully",
                };
            } else {
                return {
                    status: "error",
                    errors: res.data?.errors,
                    message: res.data?.message ?? "Email or password is incorrect"
                };
            }
        }).catch((err) => {
            return { status: "error", message: "Some problem occured." };
        });
    return result;
};

export const loginManager = (data) => {
    let result = axios
        .post(`manager/login`, data)
        .then((res) => {
            if (res.data.status === "success") {
                return {
                    status: "success",
                    data: res.data.data,
                    message: "Manager logged in successfully",
                };
            } else {
                return {
                    status: "error",
                    errors: res.data?.errors,
                    message: res.data?.message ?? "Email or password is incorrect"
                };
            }
        }).catch((err) => {
            return { status: "error", message: "Some problem occured." };
        });
    return result;
};

export const registerManager = (data) => {
    let result = axios
        .post(`manager/register`, data)
        .then((res) => {
            if (res.data.status === "success") {
                return {
                    status: "success",
                    data: res.data.data,
                    message: "Manager registered successfully",
                };
            } else {
                return {
                    status: "error",
                    errors: res.data.errors,
                    message: "Kindly fix the errors",
                };
            }
        })
        .catch((err) => {
            return { status: "error", message: "Some problem occured" };
        });
    return result;
};

export const registerStudent = (data) => {
    let result = axios
        .post(`student/register`, data)
        .then((res) => {
            if (res.data.status === "success") {
                return {
                    status: "success",
                    data: res.data.data,
                    message: "Student registered successfully",
                };
            } else {
                return {
                    status: "error",
                    errors: res.data?.errors,
                    message: "Kindly fix the errors",
                };
            }
        })
        .catch((err) => {
            return { status: "error", message: "Some problem occured" };
        });
    return result;
};