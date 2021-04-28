"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var tc = __importStar(require("@actions/tool-cache"));
var core = __importStar(require("@actions/core"));
var path = __importStar(require("path"));
var installer = __importStar(require("./installer"));
var releases = __importStar(require("./releases"));
var debug = process.argv.includes('debug');
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var bmx_ver, bmx_release, cache_dir, matchersPath, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(process.env);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    bmx_ver = core.getInput('bmx-version');
                    if (!bmx_ver)
                        bmx_ver = 'latest';
                    return [4 /*yield*/, releases.get(bmx_ver)];
                case 2:
                    bmx_release = _a.sent();
                    if (!bmx_release)
                        throw new Error("Could not find a version that satisfied version spec: " + bmx_ver);
                    // Update official release version
                    bmx_ver = bmx_release.version;
                    console.log("Using BlitzMax version " + bmx_ver);
                    cache_dir = debug ? undefined : tc.find('blitzmax', bmx_ver);
                    if (!!cache_dir) return [3 /*break*/, 4];
                    console.log("BlitzMax " + bmx_ver + " can't be found using cache, attempting to download ...");
                    return [4 /*yield*/, installer.download(bmx_release.browser_download_url, bmx_ver)];
                case 3:
                    cache_dir = _a.sent();
                    console.log("BlitzMax Installed to " + cache_dir);
                    _a.label = 4;
                case 4:
                    if (!cache_dir)
                        throw new Error("Could not initilize BlitzMax " + bmx_ver);
                    // Add BlitzMax bin folder to env variable
                    core.exportVariable('BMX_BIN', path.join(cache_dir, 'bin'));
                    if (!process.env.BMX_BIN)
                        throw new Error("Could add BlitzMax " + bmx_ver + " to PATH");
                    // Add BlitzMax bin to PATH
                    core.addPath(process.env.BMX_BIN);
                    console.log('Added BlitzMax to PATH');
                    // Set action output
                    core.setOutput('bmx-root', process.env.BMX_BIN);
                    console.log(process.env);
                    matchersPath = path.join(__dirname, '..', 'matchers.json');
                    console.log("##[add-matcher]" + matchersPath);
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    core.setFailed(error_1.message);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
run();
