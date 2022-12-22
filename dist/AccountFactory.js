"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountFactory = void 0;
const tslib_1 = require("tslib");
const qs_1 = tslib_1.__importDefault(require("qs"));
class AccountFactory {
    constructor(request) {
        this.request = request;
    }
    get() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.request.make('/v3/accounts');
            const { data } = response;
            const { _embedded } = data;
            return _embedded.items;
        });
    }
    isAvailable(subdomain) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = '/account/check_subdomain.php';
            const response = yield this.request.make(url, {
                method: "POST",
                data: {
                    subdomain
                }
            });
            const { data } = response;
            return data !== 'na';
        });
    }
    create(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const available = yield this.isAvailable(options.subdomain);
            if (!available) {
                throw new Error('ACCOUNT_IS_NOT_AVAILABLE');
            }
            const csrf = yield this.request.getCSRF();
            const params = Object.assign(Object.assign({}, options), { csrf_token: csrf });
            const url = '/account/add.php';
            const response = yield this.request.make(url, {
                method: "POST",
                data: qs_1.default.stringify(params),
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            });
            const { data } = response;
            return data.response;
        });
    }
}
exports.AccountFactory = AccountFactory;
//# sourceMappingURL=AccountFactory.js.map