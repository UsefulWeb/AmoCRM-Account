import { IEnvironment } from "./Environment";
import { IRequest } from "./Request";
export interface IAuth {
    login(): Promise<boolean>;
    logout(): void;
    isLoggedIn(): boolean;
}
export interface IToken {
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
}
export interface ILoginData {
    username: string;
    password: string;
    csrf_token: string;
}
export declare class Auth implements IAuth {
    protected cookies: string;
    protected connected: boolean;
    protected environment: IEnvironment;
    protected request: IRequest;
    constructor(environment: IEnvironment, request: IRequest);
    isLoggedIn(): boolean;
    login(): Promise<boolean>;
    logout(): void;
}
