import React, {useState} from 'react';
import { Outlet, Link } from "react-router-dom";

function Root() {
    // if noAuth, show landing page
    return (
        <div>
            <Outlet />
        </div>
    );
};

export default Root;