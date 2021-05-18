import {ConfigLoader} from "../src/config-loader";
import * as path from 'path';
import {mockClient} from "aws-sdk-client-mock";
import {GetParameterCommand, SSMClient} from "@aws-sdk/client-ssm";
import {Config, ConfigParameters} from "../lib/types";

const configDir = path.resolve(__dirname, 'config');
const ssmMock = mockClient(SSMClient);
const loader = new ConfigLoader(configDir);

interface OtherConfig extends Config {
    readonly Parameters: OtherParameters;
}

interface OtherParameters extends ConfigParameters {
    readonly otherParam: string;
}

describe('config loader', () => {

    it('should override config from SSM', async () => {
        ssmMock.on(GetParameterCommand).resolves({
            Parameter: {
                Value: '{"AWSRegion": "us-east-1"}'
            }
        });
        const defaultEnv = {
            AWSAccountId: "100",
            AWSRegion: 'us-east-1',
            Name: 'Stack',
            College: 'PCC',
            Environment: 'sdlc',
            Version: '0.0.0',
            Build: '0',
            SsmParameterStore: '<ssm-parameter-store>',
            Parameters: {}
        };
        expect(loader.load('sdlc')).resolves.toEqual(defaultEnv);
    });

    it('should throw an error with non-existent env', () => {
        expect(loader.load('none')).rejects.toThrow("ENOENT: no such file or directory, open '/app/test/config/none.json'");
    });

    it('should use default config for sdlc', () => {
        ssmMock.on(GetParameterCommand).resolves({});
        const defaultEnv = {
            AWSAccountId: "100",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: 'sdlc',
            Version: '0.0.0',
            Build: '0',
            SsmParameterStore: '<ssm-parameter-store>',
            Parameters: {}
        };

        expect(loader.load('sdlc')).resolves.toEqual(defaultEnv);
    });

    it('should override default config for prod', () => {
        ssmMock.on(GetParameterCommand).resolves({});
        const defaultEnv = {
            AWSAccountId: "200",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: 'prod',
            Version: '0.0.0',
            Build: '0',
            SsmParameterStore: '<ssm-parameter-store>',
            Parameters: {}
        };

        expect(loader.load('prod')).resolves.toEqual(defaultEnv);
    });

    it('should override default config for shared', () => {
        ssmMock.on(GetParameterCommand).resolves({});
        const defaultEnv = {
            AWSAccountId: "300",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: 'shared',
            Version: '0.0.0',
            Build: '0',
            SsmParameterStore: '<ssm-parameter-store>',
            Parameters: {}
        };

        expect(loader.load('shared')).resolves.toEqual(defaultEnv);
    });

    it('should use different config object', () => {
        ssmMock.on(GetParameterCommand).resolves({});
        const defaultEnv = {
            AWSAccountId: "100",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: 'sdlc',
            Version: '0.0.0',
            Build: '0',
            SsmParameterStore: '<ssm-parameter-store>',
            Parameters: {
                otherParam: 'foo'
            }
        };
        const typedLoader = new ConfigLoader<OtherConfig>(configDir);
        expect(typedLoader.load('other')).resolves.toEqual(defaultEnv);
    });
});


