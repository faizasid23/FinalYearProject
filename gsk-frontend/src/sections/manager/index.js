import React from 'react'
import { Helmet } from 'react-helmet';
import { Routes, Route } from "react-router-dom";
import Main from '../../components/Main';
import NotFound from '../../components/NotFound';
// Importing the views / screens
import Dashboard from "./screens/Dashboard";
import Profile from "./screens/Profile";

// This is the Index routing component for the student side
export function ManagerRoutes() {

    const renderInMasterLayout = (title, children) => {
        return (
            <div>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                <Main>
                    {children}
                </Main>
            </div>
        );
    }

    return (
        <Routes>
            <Route path='dashboard' element={renderInMasterLayout("Dashboard", <Dashboard />)} />
            <Route path='profile' element={renderInMasterLayout("Profile", <Profile />)} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}