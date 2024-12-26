
import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';



export const SoftwareTabInstall: React.FC<{selectedMinerName: string, setTabName: React.Dispatch<React.SetStateAction<string>>}> = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigStatus } = context;

    const selectedMinerName = props.selectedMinerName;
    const setTabName = props.setTabName;

    return (
        <>
            <button onClick={() => setTabName('infos')}>back</button>
            <br />
            install miner {selectedMinerName}
        </>
    );
};
