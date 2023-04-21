import React from 'react'
import { Helmet } from 'react-helmet';
import { Routes, Route } from "react-router-dom";
import Main from '../../components/Main';
import NotFound from '../../components/NotFound';
import Navbar from './components/Navbar';
// Importing the views / screens
import Dashboard from "./screens/Dashboard";
import Settings from "./screens/Settings";
import Students from './screens/Students';
import Holidays from './screens/Holidays';
import Timesheets from './screens/Timesheets';
import EffortTracking from './screens/EffortTracking';

// This is the Index routing component for the student side
export function ManagerRoutes() {

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
        <Routes>
            <Route path='dashboard' element={renderInMasterLayout("Dashboard", <Dashboard />)} />
            <Route path='students' element={renderInMasterLayout("Students", <Students />)} />
            <Route path='holidays' element={renderInMasterLayout("Holidays", <Holidays />)} />
            <Route path='timesheets' element={renderInMasterLayout("Timesheets", <Timesheets />)} />
            <Route path='effortTracking' element={renderInMasterLayout("EffortTracking", <EffortTracking />)} />
            <Route path='settings' element={renderInMasterLayout("Settings", <Settings />)} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}