
import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import LayoutHost from "./freemining/LayoutHost";
import Home from "./freemining/Home"
import Software from "./freemining/Software";
import Hardware from "./freemining/Hardware";
import NoPage from "./freemining/NoPage";

import { GlobalContext, GlobalProvider } from "../providers/global.provider";
import { useFetchJson } from "../lib/utils.client";
import { RigStatus } from "../types_client/freemining";


export const Freemining: React.FC = function () {
    return (
        <div className="container-fluid">
            <GlobalProvider>
                <GlobalLayoutWrapper />
            </GlobalProvider>
        </div>
    );
}


export const GlobalLayoutWrapper: React.FC = function () {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost } = context;

    if (! rigHost) {
        return <LayoutNoHost />;
    }

    return <LayoutHostRouter />;
}


export const LayoutNoHost: React.FC = function () {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { defaultRigHost, rigHost, setRigHost } = context;
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <form onSubmit={(event) => event.preventDefault()}>
                <label className="m-1">
                    <span className="m-1">Enter rig host:</span>
                    <input ref={inputRef} type="text" className="form-control m-1" defaultValue={rigHost || ''} placeholder={defaultRigHost || 'localhost'} />
                </label>

                <button type="submit" className="btn btn-primary m-1" onClick={(event) => setRigHost(inputRef.current?.value || '')}>change</button>

                <button type="button" className="btn btn-outline-primary m-1" onClick={(event) => setRigHost(defaultRigHost)}>{defaultRigHost}</button>
            </form>
        </>
    );
}


export const LayoutHostRouter: React.FC = function () {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, setRigHost, rigStatus, setRigStatus, rigStatusLoading, setRigStatusLoading } = context;

    const initialRigStatus = useFetchJson<RigStatus>(`http://${rigHost}/rig/status.json`, true);

    useEffect(() => {
        if (initialRigStatus) {
            // loaded
            setRigStatus(initialRigStatus);
            setRigStatusLoading(false);

        } else if (initialRigStatus === null) {
            // error
            setRigStatus(null);
            setRigStatusLoading(false);

        } else {
            // loading
            setRigStatusLoading(true);
        }
    }, [initialRigStatus])

    if (rigStatusLoading) {
        return (
            <>
                <div className="badge bg-warning m-1">
                    <span className='m-1'>{rigHost}</span>
                    <button type="button" className="btn-close m-1" aria-label="Close" onClick={() => setRigHost(null)}></button>
                </div>
                <div className="alert alert-info m-1">
                    Connecting to the rig...
                </div>
            </>
        )
    }

    if (! rigStatus) {
        return (
            <>
                <div className="badge bg-danger m-1">
                    <span className='m-1'>{rigHost}</span>
                    <button type="button" className="btn-close m-1" aria-label="Close" onClick={() => setRigHost(null)}></button>
                </div>
                <div className="alert alert-danger m-1">
                    Rig disconnected
                </div>
            </>
        )
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="mining" element={<LayoutHost />}>
                    <Route index element={<Home />} />
                    <Route path="hardware" element={<Hardware />} />
                    <Route path="software" element={<Software />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
