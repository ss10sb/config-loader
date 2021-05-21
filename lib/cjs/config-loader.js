"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigLoader = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const lodash_1 = require("lodash");
const client_ssm_1 = require("@aws-sdk/client-ssm");
class ConfigLoader {
    constructor(configDir) {
        this.configDir = configDir;
    }
    async getSsmConfig(awsRegion, ssmParamName) {
        var _a, _b;
        if (ssmParamName) {
            try {
                const client = new client_ssm_1.SSMClient({ region: awsRegion });
                const command = new client_ssm_1.GetParameterCommand({ Name: ssmParamName, WithDecryption: true });
                const response = await client.send(command);
                return JSON.parse((_b = (_a = response.Parameter) === null || _a === void 0 ? void 0 : _a.Value) !== null && _b !== void 0 ? _b : '{}');
            }
            catch (error) {
                console.log(error);
                return {};
            }
        }
        return {};
    }
    async getConfigFromFiles(env) {
        const defaultEnv = await this.getFromBase('defaults');
        const overrideEnv = await this.getFromBase(env);
        return lodash_1.merge(defaultEnv, overrideEnv);
    }
    async getFromBase(base) {
        var _a;
        const jsFile = path.resolve(this.configDir, `${base}.js`);
        if (fs.existsSync(jsFile)) {
            const results = await Promise.resolve().then(() => tslib_1.__importStar(require(jsFile)));
            return (_a = results.default) !== null && _a !== void 0 ? _a : {};
        }
        const jsonFile = path.resolve(this.configDir, `${base}.json`);
        if (fs.existsSync(jsonFile)) {
            return JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        }
        throw Error(`Environment '${base}' not found.`);
    }
    async load(env) {
        const mergedEnv = await this.getConfigFromFiles(env);
        const ssmEnv = await this.getSsmConfig(mergedEnv.AWSRegion, mergedEnv.SsmParameterStore);
        return lodash_1.merge(mergedEnv, ssmEnv);
    }
}
exports.ConfigLoader = ConfigLoader;
//# sourceMappingURL=config-loader.js.map