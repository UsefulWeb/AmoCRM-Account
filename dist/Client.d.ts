import { IAuth } from "./Auth";
import { IEnvironment } from "./Environment";
import { IClientRequest } from "./ClientRequest";
import { IRequest } from "./Request";
import { IAccountFactory, ICreateAccountOptions, ICreateAccountResponse } from "./AccountFactory";
import { IAccountData } from "./Account";
export interface IClientOptions {
    [index: string]: string | undefined | IClientAuthOptions | IClientSessionOptions;
    domain?: string;
    auth: IClientAuthOptions;
    session: IClientSessionOptions;
}
export interface IClientAuthOptions {
    username: string;
    password: string;
}
export interface IClientSessionOptions {
    filename: string;
}
export interface IClient {
    getAccounts(): Promise<IAccountData[]>;
    createAccount(options: ICreateAccountOptions): Promise<ICreateAccountResponse>;
    isAccountAvailable(domain: string): Promise<boolean>;
}
export declare class Client {
    protected readonly environment: IEnvironment;
    protected readonly request: IRequest;
    protected readonly auth: IAuth;
    protected readonly clientRequest: IClientRequest;
    protected readonly accounts: IAccountFactory;
    constructor(options: IClientOptions);
    getAccounts(): Promise<IAccountData[]>;
    createAccount(options: ICreateAccountOptions): Promise<ICreateAccountResponse>;
    isAccountAvailable(domain: string): Promise<boolean>;
}
