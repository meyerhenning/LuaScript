import * as tasklib from "azure-pipelines-task-lib";
import * as fs from "fs";
import { exec, ExecException } from "child_process";
const path = require("path");
const uuid = require("uuid");

const colorYellow = "\x1b[33m";

enum Target{
    FILE = "file",
    INLINE = "inline"
}

function handleScriptOutput(err: ExecException | null, stdout: string)
{
    if(err){
        tasklib.setResult(tasklib.TaskResult.Failed, err.message);
    }

    if(stdout){
        console.log(`${colorYellow}%s`, "## Lua Script Output ##");
        console.log(`${colorYellow}%s`, "=============================================");
        console.log("");
        console.log(stdout);
        console.log(`${colorYellow}%s`, "=============================================");
        console.log("");
    }
}

async function run() {
    try{
        const args = tasklib.getInput("arguments", false) ?? "";
        const file = tasklib.getInput("filePath", false) ?? "";
        const script = tasklib.getInput("script", false) ?? "";
        const target = tasklib.getInput("targetType", false)?.toLowerCase() ?? "";

        const tempDirectory = tasklib.getVariable("Agent.TempDirectory") ?? "";

        console.log("");

        if(target !== Target.FILE && target !== Target.INLINE){
            tasklib.setResult(tasklib.TaskResult.Failed, "The provided target type is no valid option. Choose between 'file' and 'inline'.");
            return;
        }

        if(target === Target.FILE){
            if(typeof file == undefined || file === "") {
                tasklib.setResult(tasklib.TaskResult.Failed, "The target type is set to 'file', but no file path was provided.");
                return;
            }

            console.log(`Executing '${file}'`);
            console.log("");

            exec(`lua '${file}' ${args}`, (err, stdout) => handleScriptOutput(err, stdout));

            return;
        }

        if(script === "")
        {
            tasklib.setResult(tasklib.TaskResult.Failed, "The target type is set to 'inline', but no script was provided.");
            return;
        }

        let newFilePath = path.join(tempDirectory, `${uuid.v4()}.lua`);

        fs.writeFileSync(newFilePath, script, "utf-8");

        console.log(`Created '${newFilePath}' from script`);
        console.log(`Executing '${newFilePath}'`);
        console.log("");

        exec(`lua ${newFilePath}`, (err, stdout) => handleScriptOutput(err, stdout));
    }
    catch (err: any) {
        tasklib.setResult(tasklib.TaskResult.Failed, err.message);
    }
}

run();