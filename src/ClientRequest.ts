import {IAuth} from "./Auth";
import {IRequest} from "./Request";
import {AxiosRequestConfig, AxiosResponse} from "axios";

export interface IClientRequest {
    make<T, D>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T, D>>;
    getCSRF(): Promise<string>;
}
export class ClientRequest implements IClientRequest{
    protected readonly request: IRequest;
    protected readonly auth: IAuth;
    constructor(auth: IAuth, request: IRequest) {
        this.request = request;
        this.auth = auth;
    }

    getCSRF() {
        return this.request.getCSRF();
    }

    async make<T, D>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T, D>> {
        if (!this.auth.isLoggedIn()) {
            await this.auth.login();
        }
        return await this.request.make<T, D>(url, config);
    }
}