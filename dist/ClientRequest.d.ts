import { IAuth } from "./Auth";
import { IRequest } from "./Request";
import { AxiosRequestConfig, AxiosResponse } from "axios";
export interface IClientRequest {
    make<T, D>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T, D>>;
    getCSRF(): Promise<string>;
}
export declare class ClientRequest implements IClientRequest {
    protected readonly request: IRequest;
    protected readonly auth: IAuth;
    constructor(auth: IAuth, request: IRequest);
    getCSRF(): Promise<string>;
    make<T, D>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T, D>>;
}
