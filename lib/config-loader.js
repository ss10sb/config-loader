"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigLoader = void 0;
const fs = require("fs");
const path = require("path");
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
    getConfigFromFiles(env) {
        const defaultEnv = JSON.parse(fs.readFileSync(path.resolve(this.configDir, "defaults.json"), "utf8"));
        const overrideEnv = JSON.parse(fs.readFileSync(path.resolve(this.configDir, `${env}.json`), "utf8"));
        return lodash_1.merge(defaultEnv, overrideEnv);
    }
    async load(env) {
        const mergedEnv = this.getConfigFromFiles(env);
        const ssmEnv = await this.getSsmConfig(mergedEnv.AWSRegion, mergedEnv.SsmParameterStore);
        return lodash_1.merge(mergedEnv, ssmEnv);
    }
}
exports.ConfigLoader = ConfigLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLWxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25maWctbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsbUNBQTZCO0FBRTdCLG9EQUF1RjtBQUV2RixNQUFhLFlBQVk7SUFHckIsWUFBWSxTQUFpQjtRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBRU8sS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFpQixFQUFFLFlBQXFCOztRQUMvRCxJQUFJLFlBQVksRUFBRTtZQUNkLElBQUk7Z0JBQ0EsTUFBTSxNQUFNLEdBQUcsSUFBSSxzQkFBUyxDQUFDLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sT0FBTyxHQUFHLElBQUksZ0NBQW1CLENBQUMsRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO2dCQUNwRixNQUFNLFFBQVEsR0FBdUIsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNoRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBQSxNQUFBLFFBQVEsQ0FBQyxTQUFTLDBDQUFFLEtBQUssbUNBQUksSUFBSSxDQUFDLENBQUM7YUFDeEQ7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuQixPQUFPLEVBQUUsQ0FBQzthQUNiO1NBQ0o7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTyxrQkFBa0IsQ0FBQyxHQUFXO1FBQ2xDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN0RyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsR0FBRyxPQUFPLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3JHLE9BQWUsY0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFXO1FBQ3pCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUN6RixPQUFlLGNBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUMsQ0FBQztDQUNKO0FBakNELG9DQWlDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7bWVyZ2V9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQge1NTTUNsaWVudCwgR2V0UGFyYW1ldGVyUmVzdWx0LCBHZXRQYXJhbWV0ZXJDb21tYW5kfSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LXNzbVwiO1xuXG5leHBvcnQgY2xhc3MgQ29uZmlnTG9hZGVyIHtcbiAgICByZWFkb25seSBjb25maWdEaXI6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZ0Rpcjogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY29uZmlnRGlyID0gY29uZmlnRGlyO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0U3NtQ29uZmlnKGF3c1JlZ2lvbjogc3RyaW5nLCBzc21QYXJhbU5hbWU/OiBzdHJpbmcpOiBQcm9taXNlPG9iamVjdD4ge1xuICAgICAgICBpZiAoc3NtUGFyYW1OYW1lKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBTU01DbGllbnQoe3JlZ2lvbjogYXdzUmVnaW9ufSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBHZXRQYXJhbWV0ZXJDb21tYW5kKHtOYW1lOiBzc21QYXJhbU5hbWUsIFdpdGhEZWNyeXB0aW9uOiB0cnVlfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2U6IEdldFBhcmFtZXRlclJlc3VsdCA9IGF3YWl0IGNsaWVudC5zZW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHJlc3BvbnNlLlBhcmFtZXRlcj8uVmFsdWUgPz8gJ3t9Jyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q29uZmlnRnJvbUZpbGVzKGVudjogc3RyaW5nKTogQ29uZmlnIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdEVudiA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZSh0aGlzLmNvbmZpZ0RpciwgXCJkZWZhdWx0cy5qc29uXCIpLCBcInV0ZjhcIikpO1xuICAgICAgICBjb25zdCBvdmVycmlkZUVudiA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZSh0aGlzLmNvbmZpZ0RpciwgYCR7ZW52fS5qc29uYCksIFwidXRmOFwiKSk7XG4gICAgICAgIHJldHVybiA8Q29uZmlnPm1lcmdlKGRlZmF1bHRFbnYsIG92ZXJyaWRlRW52KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgbG9hZChlbnY6IHN0cmluZyk6IFByb21pc2U8Q29uZmlnPiB7XG4gICAgICAgIGNvbnN0IG1lcmdlZEVudiA9IHRoaXMuZ2V0Q29uZmlnRnJvbUZpbGVzKGVudik7XG4gICAgICAgIGNvbnN0IHNzbUVudiA9IGF3YWl0IHRoaXMuZ2V0U3NtQ29uZmlnKG1lcmdlZEVudi5BV1NSZWdpb24sIG1lcmdlZEVudi5Tc21QYXJhbWV0ZXJTdG9yZSk7XG4gICAgICAgIHJldHVybiA8Q29uZmlnPm1lcmdlKG1lcmdlZEVudiwgc3NtRW52KTtcbiAgICB9XG59Il19