
import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext, GlobalContextType } from '../../providers/global.provider';



const Mining: React.FC = function (props: any) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigHost, rigStatus } = context;


    return (
        <>
            <pre>
                {JSON.stringify(rigStatus?.status.minersStats, null, 4)}
            </pre>
        </>
    );
}



export default Mining;

