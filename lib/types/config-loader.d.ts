import { Config } from "./config";
export declare class ConfigLoader<T extends Config> {
    readonly configDir: string;
    constructor(configDir: string);
    private getSsmConfig;
    private getConfigFromFiles;
    load(env: string): Promise<T>;
}
