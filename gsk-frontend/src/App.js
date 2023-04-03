import React, { Suspense } from "react";
// importing elements from latest react router dom to route our application
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { withRouter } from "./utils/router"
// importing stuff for redux-ing our app
import { connect, Provider } from "react-redux";
import store from "./redux/Store";
import {
  setUser,
  clearUser
} from "./redux/ActionCreators";
// import reusable components/screens for our App UI
import FullscreenLoader from "./components/FullscreenLoader";
import LoginForm from "./components/LoginForm/";
import RegisterForm from "./components/RegisterForm/";
import Homepage from "./components/HomePage/";
// API calls
import { validateToken } from "./apis/user";
import { updateAuthorizationToken, setClearRedux } from "./apis/axiosConfig";
// UI 3rd party lib overriding
import { ThemeProvider } from "@mui/styles";
import { createTheme } from '@mui/material/styles';

// const Student = React.lazy(() => import("./sections/student/"));
// const Manager = React.lazy(() => import("./sections/manager/"));

// Here we are Overriding material UI theme basics
const theme = createTheme({
  typography: {
    fontFamily: [
      "Lato",
      "TTNorms",
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  palette: {
    primary: {
      main: "#F36633",
      light: "#F3663350",
      dark: "#F36633",
      contrastText: "#fff",
    },
    secondary: {
      main: "#FC443E",
      dark: "#EC3A34",
      light: "#FB5954",
      contrastText: "#fff"
    }
  }
});

class AppUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      hasError: false,
      isSubmitLoading: false,
      role: "",
      isUnauthorized: false
    };
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);

    setClearRedux(this.props.clearUser);
    // check if token exists in the localstorage
    let token = localStorage.getItem("user_verif");
    let user = localStorage.getItem("user");
    let role = localStorage.getItem("user_role");

    this.setState({ role: role });

    if (token !== null && user !== null) {
      // valdiate token
      validateToken(role, token).then((result) => {
        // set student info here
        // redirect to login if some issue
        let userJson = JSON.parse(user);

        if (result.response && result.response.status === 401) {
          this.props.setUser({
            user: userJson ?? null,
            isVerified: false,
            isVerifying: false,
            role: role
          });
          return;
        }

        if (result.data && result.data.status === "success") {
          if (result.data.data !== undefined)
            userJson = { ...userJson, ...result.data.data.user };

          // update auth token
          updateAuthorizationToken(token);
          // if (role === "employee") this.props.setEmployeeInfo(result.data.data);
          // else if (role === "employer") this.props.setEmployerInfo(result.data.data);

          // store user in redux store
          this.props.setUser({
            user: userJson ? userJson : null,
            isVerified: true,
            isVerifying: false,
            role: role,
            subRole: result.data?.staff_role,
          });

          // redirect
          let path = window.location.pathname;
          // eslint-disable-next-line
          let re = `\/${role}\/`;
          let results = path.match(re);
          if (results === null) this.props.history.push(`/${role}/dashboard`);
        } else if (result.data && result.data?.status === "failure") {
          localStorage.removeItem("user");
          localStorage.removeItem("user_role");
          localStorage.removeItem("user_verif");
          // localStorage.removeItem("skip_2fa");
          this.props.setUser({
            user: null,
            role: null,
            isVerified: false,
            isVerifying: false,
          });
        } else {
          // TODO: allow app if the user is offline
          this.props.setUser({
            user: userJson ?? null,
            isVerified: true,
            isVerifying: false,
            role: role,
          });
          this.setState({ hasError: true });
        }
      });
    } else {
      // if the token is invalid
      localStorage.removeItem("user");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_verif");
      // localStorage.removeItem("skip_2fa");
      this.props.setUser({
        user: null,
        role: null,
        isVerified: false,
        isVerifying: false
      });
    }
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginForm fullScreen />} />
          <Route path="/register" element={<RegisterForm fullScreen />} />
          <Route path="/admin/login" element={<LoginForm fullScreen />} />
          <Route path="/admin" element={() => <Navigate to="/admin/login?role=admin" replace />} />
          <Route path="/*" element={() => <Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state) => { return state.user };

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
    clearUser: () => dispatch(clearUser())
  };
};

const AppUIWrapper = connect(mapStateToProps, mapDispatchToProps)(withRouter(AppUI));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<FullscreenLoader />}>
            <AppUIWrapper />
          </Suspense>
        </BrowserRouter>
      </Provider>
    );
  };
}

export default App;