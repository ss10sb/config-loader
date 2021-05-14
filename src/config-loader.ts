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

    private getConfigFromFiles(env: string): T {
        const defaultEnv = JSON.parse(fs.readFileSync(path.resolve(this.configDir, "defaults.json"), "utf8"));
        const overrideEnv = JSON.parse(fs.readFileSync(path.resolve(this.configDir, `${env}.json`), "utf8"));
        return <T>merge(defaultEnv, overrideEnv);
    }

    public async load(env: string): Promise<T> {
        const mergedEnv = this.getConfigFromFiles(env);
        const ssmEnv = await this.getSsmConfig(mergedEnv.AWSRegion, mergedEnv.SsmParameterStore);
        return <T>merge(mergedEnv, ssmEnv);
    }
}