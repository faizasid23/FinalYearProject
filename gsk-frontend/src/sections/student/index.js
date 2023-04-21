import React from 'react'
import { Helmet } from 'react-helmet';
import { Routes, Route } from "react-router-dom";
// importing our reusable components 
import Navbar from './components/Navbar';
import Main from '../../components/Main';
import NotFound from '../../components/NotFound';
// Importing the views / screens
import Dashboard from "./screens/Dashboard";
import Timesheets from "./screens/Timesheets";
import Holidays from "./screens/Holidays";
import EffortTracking from "./screens/EffortTracking";
import Settings from "./screens/Settings";


// This is the Index routing component for the student side
export function StudentRoutes(props) {

    const renderInMasterLayout = (title, children) => {
        return (
            <div>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                <Navbar />
                <Main>
                    {children}
                </Main>
            </div>
        );
    }

    return (
        <Routes key={props.location.key}>
            <Route path='dashboard' element={renderInMasterLayout("Dashboard", <Dashboard />)} />
            <Route path='timesheets' element={renderInMasterLayout("Timesheets", <Timesheets />)} />
            <Route path='holidays' element={renderInMasterLayout("Holidays", <Holidays />)} />
            <Route path='effortTracking' element={renderInMasterLayout("EffortTracking", <EffortTracking />)} />
            {/* <Route path='profile' element={renderInMasterLayout("Profile", <Profile />)} /> */}
            <Route path='settings' element={renderInMasterLayout("Settings", <Settings />)} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
