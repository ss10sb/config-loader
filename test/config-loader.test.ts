import {ConfigLoader} from "../src/config-loader";
import * as path from 'path';
import {mockClient} from "aws-sdk-client-mock";
import {GetParameterCommand, SSMClient} from "@aws-sdk/client-ssm";

const configDir = path.resolve(__dirname, 'config');
const ssmMock = mockClient(SSMClient);
const loader = new ConfigLoader(configDir);

describe('config loader', () => {

    it('should override config from SSM', async () => {
        ssmMock.on(GetParameterCommand).resolves({
            Parameter: {
                Value: '{"AWSRegion": "us-east-1"}'
            }
        });
        const defaultEnv = {
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
});


