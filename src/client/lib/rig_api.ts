
import { GlobalContextType } from '../providers/global.provider';

import type { RigStatus } from '../types_client/freemining';
import { fetchJson } from './utils.client';



export const getRigStatus = async (rigHost: string): Promise<RigStatus | null> => {
    return fetchJson<RigStatus>(`http://${rigHost}/rig/status.json`, { useProxy: true })
        .then((newRigStatus) => {
            return newRigStatus ? newRigStatus.data : null;
        });
}
