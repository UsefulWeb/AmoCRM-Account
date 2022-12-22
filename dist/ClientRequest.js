"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRequest = void 0;
const tslib_1 = require("tslib");
class ClientRequest {
    constructor(auth, request) {
        this.request = request;
        this.auth = auth;
    }
    getCSRF() {
        return this.request.getCSRF();
    }
    make(url, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.auth.isLoggedIn()) {
                yield this.auth.login();
            }
            return yield this.request.make(url, config);
        });
    }
}
exports.ClientRequest = ClientRequest;
//# sourceMappingURL=ClientRequest.js.map