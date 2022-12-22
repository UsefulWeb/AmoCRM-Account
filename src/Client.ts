import {Auth, IAuth} from "./Auth";
import {Environment, IEnvironment} from "./Environment";
import {ClientRequest, IClientRequest} from "./ClientRequest";
import {IRequest, Request} from "./Request";
import {AccountFactory, IAccountFactory, ICreateAccountOptions, ICreateAccountResponse} from "./AccountFactory";
import {IAccountData} from "./Account";

export interface IClientOptions {
    [index: string]: string|undefined|IClientAuthOptions|IClientSessionOptions;
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
export class Client {
    protected readonly environment: IEnvironment;
    protected readonly request: IRequest;
    protected readonly auth: IAuth;
    protected readonly clientRequest: IClientRequest;
    protected readonly accounts: IAccountFactory;

    constructor(options: IClientOptions) {
        this.environment = new Environment(options);
        this.request = new Request(this.environment);
        this.auth = new Auth(this.environment, this.request);
        this.clientRequest = new ClientRequest(this.auth, this.request);

        this.accounts = new AccountFactory(this.clientRequest);
    }

    async getAccounts() {
        return this.accounts.get();
    }

    async createAccount(options: ICreateAccountOptions) {
        return this.accounts.create(options);
    }

    async isAccountAvailable(domain: string) {
        return this.accounts.isAvailable(domain);
    }
}