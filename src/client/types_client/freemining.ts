
export type RigStatus = {
    config: RigStatusConfig,
    dataDate: number,
    rig: RigStatusRig,
    status: RigStatusStatus,
    systemInfos: RigStatusSystemInfos,
    usage: RigStatusUsage,
};

export type RigStatusConfig = {
    coins:        {[coin: string]: RigStatusConfigCoin},
    coinsWallets: RigStatusConfigCoinsWallets,
    coinsPools:   {[coin: string]: RigStatusConfigCoinPools},
    coinsMiners:  {[coin: string]: RigStatusConfigCoinMiners},

    farmAgent: { host: string, pass: string, port: number },
    miners: {[minerName: string]: { apiPort?: number, extraArgs?: string }},
    name: string,
    showNotManagedRigs: boolean,
    dataDate: number,
};


export type RigStatusConfigCoin = { algo: string, coinName: string, explorer?: string };

export type RigStatusConfigCoinsWallets = {[coin: string]: RigStatusConfigCoinWallets};
export type RigStatusConfigCoinWallets  = {[walletName: string]: RigStatusConfigCoinWallet};
export type RigStatusConfigCoinWallet   = string;

export type RigStatusConfigCoinPools = {[poolName: string]: RigStatusConfigCoinPool};
export type RigStatusConfigCoinPool  = { urls: {[urlName: string]: string}, user: string };

export type RigStatusConfigCoinMiners = {[minerName: string]: RigStatusConfigCoinMiner};
export type RigStatusConfigCoinMiner  = { algo?: string, extraArgs?: string };



export type RigStatusRig = {
    freeminingVersion: string,
    hostname: string,
    ip: string,
    name: string,
    os: string,
};

export type RigStatusStatus = {
    farmAgentStatus: boolean,
    installableMiners: string[],
    installedMiners: string[],
    installedMinersAliases: {[minerName: string]: RigStatusStatusInstalledMinerAliases},
    managedMiners: string[],
    minersStats: {[minerAlias: string]: RigStatusStatusInstalledMinerStats},
    monitorStatus: boolean,
    runnableMiners: string[],
    runningMiners: string[],
    runningMinersAliases: {[minerName: string]: {[instanceName: string]: RigStatusStatusRunningMinerAlias}},
};

export type RigStatusStatusInstalledMinerAliases = {
    defaultAlias: string,
    lastVersion: string,
    name: string,
    title: string,
    versions: {[minerAlias: string]: RigStatusStatusInstalledMinerAlias},
};

export type RigStatusStatusInstalledMinerAlias = {
    alias: string,
    installDate: string,
    installUrl: string,
    name: string,
    version: string,
};

export type RigStatusStatusInstalledMinerStats = {
    dataDate: number,
    devices: {
        cpus: any[],
        gpus: {
            fanSpeed: number,
            hashRate: number,
            id: number,
            name: string,
            power: number,
            temperature: number,
            subDeviceId?: string,
        }[],
    },
    miner: {
        algo: string,
        hashRate: number,
        minerAlias: string,
        minerName: string,
        name: string,
        uptime: number,
        worker: string,
    },
    pool: {
        account: string,
        url: string,
    },
};

export type RigStatusStatusRunningMinerAlias = {
    alias: string,
    args: string[],
    dateStart: number,
    miner: string,
    params: {
        algo: string,
        coin: string,
        extraArgs: string[],
        miner: string,
        poolUrl: string,
        poolUser: string,
    },
    pid: number,
};

export type RigStatusSystemInfos = {
    board: { manufacturer: string, model: string },
    cpu: {
        brand: string,
        cores: number,
        manufacturer: string,
        physicalCores: number,
        processors: number,
        speed: number,
        vendor: string,
    },
    disks: {
        device: string,
        interfaceType: string,
        name: string,
        size: number,
        type: string,
        vendor: string,
    }[],
    fs: {
        available: number | null,
        fs: string,
        mount: string,
        rw: boolean,
        size: number | null,
        type: string,
        use: number | null,
        used: number | null,
    }[],
    gpus: {
        clockCore: number,
        clockMemory: number,
        driverVersion: string,
        idx: number,
        memoryFree: number,
        memoryTotal: number,
        model: string,
        name: string,
        powerDraw: number,
        powerLimit: number,
        temperatureGpu: number,
        vendor: string,
        subDeviceId: string,
    }[],
    net: {
        gateway: string,
        interface: {
            default: boolean,
            dhcp: boolean,
            duplex: string,
            iface: string,
            ifaceName: string,
            ip4: string,
            ip4subnet: string,
            ip6: string,
            ip6subnet: string,
            mac: string,
            mtu: number,
            speed: number,
            type: string,
            virtual: boolean,
        },
    },
    os: {
        arch: string,
        codename: string,
        distro: string,
        hostname: string,
        kernel: string,
        platform: string,
    },
};

export type RigStatusUsage = {
    cpuLoad: number,
    loadAvg: number,
    memory: {
        total: number,
        used: number,
    },
    uptime: number,
};

