
import React, { useContext, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";

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


    return (
        <>
            <div className='d-flex'>
                <div className={`badge ${rigStatus ? "bg-success" : "bg-danger"} m-1`}>
                    <span className='m-1'>{rigHost}</span>
                    <button type="button" className="btn-close m-1" aria-label="Close" onClick={() => setRigHost(null)}></button>
                </div>

                <div>
                    <button type="button" className="btn btn-secondary m-1" onClick={() => reloadHost()}>Reload</button>
                </div>

            </div>

            <nav className='navbar navbar-expand-lg'>
                <div className="container-fluid">
                    <Link to="/mining" className='navbar-brand'>Home</Link>

                    <div className="collapse navbar-collapse">
                        <ul className='navbar-nav'>
                            <li className="nav-item">
                                <Link to="/mining/hardware" className='navbar-brand'>Hardware</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/mining/software" className='navbar-brand'>Software</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/mining/mining" className='navbar-brand'>Mining</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <Outlet />
        </>
    )
};


export default LayoutHost;

