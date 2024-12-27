
import React, { useContext, useEffect } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";

import { GlobalContext } from '../../providers/global.provider';
import { fetchJson } from '../../lib/utils.client';
import { RigStatus } from '../../types_client/freemining';


const LayoutHost: React.FC = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, setRigHost, rigStatus, setRigStatus, setRigStatusLoading } = context;

    const reloadHost = () => {
        setRigStatusLoading(true);

        fetchJson<RigStatus>(`http://${rigHost}/rig/status.json`, { useProxy: true })
            .then((newRigStatus) => {
                setRigStatus(newRigStatus ? newRigStatus.data : null);
            })
            .finally(() => {
                setRigStatusLoading(false);
            })
    }

    const location = useLocation();


    return (
        <>
            <div className='d-flex'>
                <div className={`badge ${rigStatus ? "bg-success" : "bg-danger"} m-1`}>
                    <span className='m-1'>{rigHost} {rigStatus? ` - ${rigStatus.rig.name}` : ''}</span>
                    <button type="button" className="btn-close m-1" aria-label="Close" onClick={() => setRigHost(null)}></button>
                </div>

                <div>
                    <button type="button" className="btn btn-secondary m-1" onClick={() => reloadHost()}>Reload</button>
                </div>

            </div>

            <nav className='navbar navbar-expand-lg'>
                <Link to="/mining" className={`navbar-brand ${location.pathname === '/mining' ? "bold" : ""}`}>Home</Link>
                <Link to="/mining/hardware" className={`navbar-brand ${location.pathname === '/mining/hardware' ? "bold" : ""}`}>Hardware</Link>
                <Link to="/mining/software" className={`navbar-brand ${location.pathname === '/mining/software' ? "bold" : ""}`}>Software</Link>
                <Link to="/mining/mining" className={`navbar-brand ${location.pathname === '/mining/mining' ? "bold" : ""}`}>Mining</Link>
            </nav>

            <Outlet />
        </>
    )
};


export default LayoutHost;

