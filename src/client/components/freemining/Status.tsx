
import React, { useContext } from 'react';

import { GlobalContext } from '../../providers/global.provider';



const Status: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;


    return (
        <>
            <pre>
                {JSON.stringify(rigStatus, null, 4)}
            </pre>
        </>
    );
}



export default Status;

