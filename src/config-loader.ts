import * as fs from 'fs';
import * as path from "path";
import {merge} from 'lodash';
import {Config} from "./config";
import {SSMClient, GetParameterResult, GetParameterCommand} from "@aws-sdk/client-ssm";

export class ConfigLoader {
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

    private getConfigFromFiles(env: string): Config {
        const defaultEnv = JSON.parse(fs.readFileSync(path.resolve(this.configDir, "defaults.json"), "utf8"));
        const overrideEnv = JSON.parse(fs.readFileSync(path.resolve(this.configDir, `${env}.json`), "utf8"));
        return <Config>merge(defaultEnv, overrideEnv);
    }

    public async load(env: string): Promise<Config> {
        const mergedEnv = this.getConfigFromFiles(env);
        const ssmEnv = await this.getSsmConfig(mergedEnv.AWSRegion, mergedEnv.SsmParameterStore);
        return <Config>merge(mergedEnv, ssmEnv);
    }
}