"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var tasklib = require("azure-pipelines-task-lib");
var fs = require("fs");
var child_process_1 = require("child_process");
var path = require("path");
var uuid = require("uuid");
var colorYellow = "\x1b[33m";
var Target;
(function (Target) {
    Target["FILE"] = "file";
    Target["INLINE"] = "inline";
})(Target || (Target = {}));
function handleScriptOutput(err, stdout) {
    if (err) {
        tasklib.setResult(tasklib.TaskResult.Failed, err.message);
    }
    if (stdout) {
        console.log("".concat(colorYellow, "%s"), "## Lua Script Output ##");
        console.log("".concat(colorYellow, "%s"), "=============================================");
        console.log("");
        console.log(stdout);
        console.log("".concat(colorYellow, "%s"), "=============================================");
        console.log("");
    }
}
function run() {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function () {
        var args, file, script, target, tempDirectory, newFilePath;
        return __generator(this, function (_g) {
            try {
                args = (_a = tasklib.getInput("arguments", false)) !== null && _a !== void 0 ? _a : "";
                file = (_b = tasklib.getInput("filePath", false)) !== null && _b !== void 0 ? _b : "";
                script = (_c = tasklib.getInput("script", false)) !== null && _c !== void 0 ? _c : "";
                target = (_e = (_d = tasklib.getInput("targetType", false)) === null || _d === void 0 ? void 0 : _d.toLowerCase()) !== null && _e !== void 0 ? _e : "";
                tempDirectory = (_f = tasklib.getVariable("Agent.TempDirectory")) !== null && _f !== void 0 ? _f : "";
                console.log("");
                if (target !== Target.FILE && target !== Target.INLINE) {
                    tasklib.setResult(tasklib.TaskResult.Failed, "The provided target type is no valid option. Choose between 'file' and 'inline'.");
                    return [2 /*return*/];
                }
                if (target === Target.FILE) {
                    if (typeof file == undefined || file === "") {
                        tasklib.setResult(tasklib.TaskResult.Failed, "The target type is set to 'file', but no file path was provided.");
                        return [2 /*return*/];
                    }
                    console.log("Executing '".concat(file, "'"));
                    console.log("");
                    (0, child_process_1.exec)("lua '".concat(file, "' ").concat(args), function (err, stdout) { return handleScriptOutput(err, stdout); });
                    return [2 /*return*/];
                }
                if (script === "") {
                    tasklib.setResult(tasklib.TaskResult.Failed, "The target type is set to 'inline', but no script was provided.");
                    return [2 /*return*/];
                }
                newFilePath = path.join(tempDirectory, "".concat(uuid.v4(), ".lua"));
                fs.writeFileSync(newFilePath, script, "utf-8");
                console.log("Created '".concat(newFilePath, "' from script"));
                console.log("Executing '".concat(newFilePath, "'"));
                console.log("");
                (0, child_process_1.exec)("lua ".concat(newFilePath), function (err, stdout) { return handleScriptOutput(err, stdout); });
            }
            catch (err) {
                tasklib.setResult(tasklib.TaskResult.Failed, err.message);
            }
            return [2 /*return*/];
        });
    });
}
run();
