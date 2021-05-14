export interface Config {
    readonly AWSRegion: string;
    readonly Name: string;
    readonly College: string;
    readonly Environment: string;
    readonly Version?: string;
    readonly Build?: string;
    readonly SsmParameterStore?: string;
    readonly Parameters: BuildParameters;
}
export interface BuildParameters {
}
