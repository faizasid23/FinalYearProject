import * as ActionTypes from "../ActionTypes";

export const user = (
    state = { user: null, role: null, isVerified: false, isVerifying: true },
    action
) => {
    switch (action.type) {
        // set the user initialy
        case ActionTypes.SET_USER:
            return { ...state, ...action.payload };
        // update the user when some edit is performed
        case ActionTypes.UPDATE_USER:
            let newUser = { ...state.user, ...action.payload.user };
            localStorage.setItem("user", JSON.stringify(newUser));
            return { ...state, user: newUser };
        // clear the user on logout and stuff
        case ActionTypes.CLEAR_USER:
            return { user: null, role: null, isVerified: false, isVerifying: false };
        default:
            return state;
    }
};
