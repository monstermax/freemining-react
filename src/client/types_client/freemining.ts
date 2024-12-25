
export type RigStatus = {
    config: RigStatusConfig,
    dataDate: number,
    rig: RigStatusRig,
    status: RigStatusStatus,
    systemInfos: RigStatusSystemInfos,
    usage: RigStatusUsage,
};

type RigStatusConfig = {
    coins:        {[coin: string]: { algo: string, coinName: string, explorer?: string }},
    coinsMiners:  {[coin: string]: {[minerName: string]: { algo?: string, extraArgs?: string }}},
    coinsPools:   {[coin: string]: {[poolName: string]: { urls: {[urlName: string]: string}, user: string }}},
    coinsWallets: {[coin: string]: {[walletName: string]: string}},
    farmAgent: { host: string, pass: string, port: number },
    miners: {[minerName: string]: { apiPort?: number, extraArgs?: string }},
    name: string,
    showNotManagedRigs: boolean,
    dataDate: number,
};

type RigStatusRig = {
    freeminingVersion: string,
    hostname: string,
    ip: string,
    name: string,
    os: string,
};

type RigStatusStatus = {
    farmAgentStatus: boolean,
    installableMiners: string[],
    installedMiners: string[],
    installedMinersAliases: {[minerName: string]: RigStatusStatusInstalledMinerAliases},
    managedMiners: string[],
    minersStats: {[minerAlias: string]: RigStatusStatusInstalledMinerStats},
    monitorStatus: boolean,
    runnableMiners: string[],
    runningMiners: string[],
    runningMinersAliases: {[minerName: string]: {[minerAlias: string]: RigStatusStatusRunningMinerAlias}},
};

type RigStatusStatusInstalledMinerAliases = {
    defaultAlias: string,
    lastVersion: string,
    name: string,
    title: string,
    versions: {[minerAlias: string]: RigStatusStatusInstalledMinerAlias},
};

type RigStatusStatusInstalledMinerAlias = {
    alias: string,
    installDate: string,
    installUrl: string,
    name: string,
    version: string,
};

type RigStatusStatusInstalledMinerStats = {
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

type RigStatusStatusRunningMinerAlias = {
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

type RigStatusSystemInfos = {
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

type RigStatusUsage = {
    cpuLoad: number,
    loadAvg: number,
    memory: {
        total: number,
        used: number,
    },
    uptime: number,
};

