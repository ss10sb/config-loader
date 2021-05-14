import { Config } from "./config";
export declare class ConfigLoader {
    readonly configDir: string;
    constructor(configDir: string);
    private getSsmConfig;
    private getConfigFromFiles;
    load(env: string): Promise<Config>;
}
