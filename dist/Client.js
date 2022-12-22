"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const tslib_1 = require("tslib");
const Auth_1 = require("./Auth");
const Environment_1 = require("./Environment");
const ClientRequest_1 = require("./ClientRequest");
const Request_1 = require("./Request");
const AccountFactory_1 = require("./AccountFactory");
class Client {
    constructor(options) {
        this.environment = new Environment_1.Environment(options);
        this.request = new Request_1.Request(this.environment);
        this.auth = new Auth_1.Auth(this.environment, this.request);
        this.clientRequest = new ClientRequest_1.ClientRequest(this.auth, this.request);
        this.accounts = new AccountFactory_1.AccountFactory(this.clientRequest);
    }
    getAccounts() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.accounts.get();
        });
    }
    createAccount(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.accounts.create(options);
        });
    }
    isAccountAvailable(domain) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.accounts.isAvailable(domain);
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map