
import React, { useContext, useEffect, useRef, useState } from "react";

import { GlobalContext, GlobalProvider } from "../providers/global.provider";

import { LayoutHostRouter } from "./freemining/LayoutHost";
import { LayoutNoHost } from "./freemining/LayoutNoHost";


// MAIN APP
export const Freemining: React.FC = function () {
    return (
        <div className="container-fluid">
            <GlobalProvider>
                <GlobalLayoutWrapper />
            </GlobalProvider>
        </div>
    );
}


// CONTEXT WRAPPER
export const GlobalLayoutWrapper: React.FC = function () {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost } = context;

    // No rig connected
    if (! rigHost) {
        return <LayoutNoHost />;
    }

    // Connected to a rig
    return <LayoutHostRouter />;
}


