
import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '../../providers/global.provider';


// TODO: a deplacer dans une route autonome : /mining/software/install


export const SoftwareTabInstall: React.FC<{selectedMinerName?: string | null, closeSoftwarePopup: () => void, setTabName: React.Dispatch<React.SetStateAction<string>>}> = function (props) {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context GlobalProvider not found");

    const { rigStatus } = context;

    const selectedMinerName = props.selectedMinerName ?? null;
    const setTabName = props.setTabName;
    const closeSoftwarePopup = props.closeSoftwarePopup;

    return (
        <>
            <button onClick={() => setTabName('infos')}>back</button>
            <br />
            install miner
        </>
    );
};
