import * as fs from 'fs';
import * as path from "path";
import {merge} from 'lodash';
import {SSMClient, GetParameterResult, GetParameterCommand} from "@aws-sdk/client-ssm";
import {Config} from "./config";

export class ConfigLoader<T extends Config> {
    readonly configDir: string;

    constructor(configDir: string) {
        this.configDir = configDir;
    }

    private async getSsmConfig(awsRegion: string, ssmParamName?: string): Promise<object> {
        if (ssmParamName) {
            try {
                const client = new SSMClient({region: awsRegion});
                const command = new GetParameterCommand({Name: ssmParamName, WithDecryption: true});
                const response: GetParameterResult = await client.send(command);
                return JSON.parse(response.Parameter?.Value ?? '{}');
            } catch (error) {
                console.log(error);
                return {};
            }
        }
        return {};
    }

    private async getConfigFromFiles(env: string): Promise<T> {
        const defaultEnv = await this.getFromBase('defaults');
        const overrideEnv = await this.getFromBase(env);
        return <T>merge(defaultEnv, overrideEnv);
    }

    private async getFromBase(base: string): Promise<object> {
        const jsFile = path.resolve(this.configDir, `${base}.js`);
        if (fs.existsSync(jsFile)) {
            const results = await import(jsFile);
            return results.default ?? {};
        }
        const jsonFile = path.resolve(this.configDir, `${base}.json`);
        if (fs.existsSync(jsonFile)) {
            return JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        }
        throw Error(`Environment '${base}' not found.`);
    }

    public async load(env: string): Promise<T> {
        const mergedEnv = await this.getConfigFromFiles(env);
        const ssmEnv = await this.getSsmConfig(mergedEnv.AWSRegion, mergedEnv.SsmParameterStore);
        return <T>merge(mergedEnv, ssmEnv);
    }
}