import React, { Suspense } from "react";
// importing elements from latest react router dom to route our application
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./components/NotFound";
// API calls
import { validateToken } from "./apis/user";
import { updateAuthorizationToken, setClearRedux } from "./apis/axiosConfig";
// UI 3rd party lib overriding
import { ThemeProvider } from "@mui/styles";
import { createTheme } from '@mui/material/styles';
// importing subroutes from sections
import { StudentRoutes } from "./sections/student/";
import { ManagerRoutes } from "./sections/manager/";
// importing these providers to use with date time library
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


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
      main: "#343541",
      dark: "#8f8f8f87",
      light: "#202123",
      contrastText: "#fff"
    }
  }
});

class AppUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      role: ""
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

        if (result.status === 500) {
          localStorage.removeItem("user");
          localStorage.removeItem("user_role");
          localStorage.removeItem("user_verif");
          this.props.setUser({
            user: null,
            role: null,
            isVerified: false,
            isVerifying: false
          });
          this.props.history(`/`);
          return;
        }
        else if (result?.data?.status === "success") {
          if (result.data.data !== undefined)
            userJson = { ...userJson, ...result.data.data.user };

          // update auth token
          updateAuthorizationToken(token);

          // store user in redux store
          this.props.setUser({
            user: userJson ?? null,
            isVerified: true,
            isVerifying: false,
            role: role
          });

          // redirect
          let path = window.location.pathname;
          // eslint-disable-next-line
          let re = `\/${role}\/`;
          let results = path.match(re);
          if (results === null) this.props.history(`/${role}/dashboard`);
        }
        else {
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
      this.props.setUser({
        user: null,
        role: null,
        isVerified: false,
        isVerifying: false
      });
      this.props.history(`/`);
    }
  }

  render() {
    let { isVerifying, isVerified } = this.props;

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          {isVerifying ? <FullscreenLoader />
            : (
              isVerified ?
                <Routes>
                  <Route path="/student/*" element={<StudentRoutes />} />
                  <Route path="/manager/*" element={<ManagerRoutes />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                :
                <Routes>
                  <Route exact path="/" element={<Homepage />} />
                  <Route path="/login" element={<LoginForm fullScreen key={this.props.location.key} />} />
                  <Route path="/register" element={<RegisterForm fullScreen key={this.props.location.key} />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
            )}
        </ThemeProvider>
      </LocalizationProvider>
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