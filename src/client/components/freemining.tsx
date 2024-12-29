
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
import Mining from "./freemining/Mining";
import Settings from "./freemining/Settings";
import Status from "./freemining/Status";
import Coins from "./freemining/Coins";
import { SoftwareInstall } from "./freemining/SoftwareInstall";
import { SoftwareRun } from "./freemining/SoftwareRun";


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

    const { rigHost, setRigHost } = context;
    const { favoritesHosts } = context;
    const inputRef = useRef<HTMLInputElement>(null);

    const [defaultRigHost, setDefaultRigHost] = useState<string | null>('127.0.0.1');


    useEffect(() => {
        inputRef.current?.focus();
    })

    const setRigHostSafe = (_rigHost: string) => {
        if (! _rigHost.includes(':')) {
            _rigHost += ':1234';
        }

        setRigHost(_rigHost);
    }

    return (
        <>

            <nav className='navbar navbar-expand-lg bg-dark text-light mb-1 p-1'>
                <h1 className='h2 cursor-default'>Riggle</h1>

                <div className="ms-auto">
                    <div className={`badge bg-danger m-1 cursor-default`}>
                        <span className='m-1'>not connected</span>
                        <button type="button" className="btn m-1"></button>
                    </div>
                </div>
            </nav>

            <div className="m-1">
                <form onSubmit={(event) => event.preventDefault()}>
                    <div className="m-1 alert alert-info text-center">
                        <label className="text-start">
                            <span className="m-1">Connect to the rig:</span>

                            <div className="d-flex">
                                <input ref={inputRef} type="text" className="form-control m-1" defaultValue={rigHost || ''} placeholder={defaultRigHost || 'localhost'} />

                                <button type="submit" className="btn btn-primary m-1" onClick={(event) => setRigHostSafe(inputRef.current?.value || '')}>connect</button>
                            </div>
                        </label>
                    </div>
                    <br />

                    {favoritesHosts.length > 0 && (
                        <div className="m-1 alert alert-info text-center">
                            <h2 className="h4">Favorites</h2>

                            {favoritesHosts.map(host => {
                                return (
                                    <button key={host} type="button" className="btn btn-outline-secondary m-1" onClick={(event) => setRigHost(host)}>{host.replace(':1234', '')}</button>
                                );
                            })}
                        </div>
                    )}
                </form>
            </div>
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
                    <Route path="software/install" element={<SoftwareInstall />} />
                    <Route path="software/uninstall" element={<Software />} />
                    <Route path="software/run" element={<SoftwareRun />} />
                    <Route path="software/stop" element={<Software />} />
                    <Route path="mining" element={<Mining />} />
                    <Route path="coins" element={<Coins />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="status" element={<Status />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
