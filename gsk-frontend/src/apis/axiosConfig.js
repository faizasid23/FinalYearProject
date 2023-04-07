// for API calls we are importing and using axios library
import Axios from "axios";
import CONSTANTS from "../utils/constants";

let clearReduxCallback = undefined;

// import a base URL which can change b/w local and the hosting one
const axios = Axios.create({ baseURL: CONSTANTS.apiBaseURL });

axios.CancelToken = Axios.CancelToken;
axios.interceptors.response.use((res) => {
    return res;
},
    async (error) => {
        // if user is unauthorized
        if (error.response?.status === 401) {
            await localStorage.removeItem("user");
            await localStorage.removeItem("user_role");
            await localStorage.removeItem("user_verif");
            if (clearReduxCallback !== undefined) {
                clearReduxCallback();
            }
        }
        return error.response;
    }
);

export const setClearRedux = (callback) => {
    clearReduxCallback = callback;
};

export const updateAuthorizationToken = (token) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};

export { axios };