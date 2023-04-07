# Lua Script

Lua Script is an Azure DevOps Extension that provides a task for executing a Lua script.

It is possible to:
- execute a given Lua file, optionally with arguments
- execute inline Lua code

## Installation
Get it from the Visual Studio Marketplace: <br>
https://marketplace.visualstudio.com/items?itemName=HenningMeyer.lua-script

## Agent Specification

✅ windows-latest <br> ✅ macos-latest <br> ✅ ubuntu-latest

## Usage

### File

```yml
steps:
- task: Lua@0
  displayName: 'Execute Lua Script'
  inputs:
    target: file
    path: test.lua
    args: arg1 2023 arg3
```

### Inline

```yml
steps:
- task: Lua@0
  displayName: 'Execute Lua Script'
  inputs:
    target: inline
    script: |
        local function read_file(path)
            local file = assert(io.open(path, "r"))
            local contents = assert(file:read("a"))
            file:close()
            return contents
        end

        print(read_file("test.txt"))
```

| Parameter | Aliases | Required | Description
| - | - | - | - |
| arguments | args | false | The arguments that can be passed to a given Lua file <br> Optional if targetType = file |
| filePath | path | false | The path of the Lua file to execute <br> Required if targetType = file |
| script | | false | The inline script to execute <br> Required if targetType = inline
| targetType | target | false | The target type <br> Options: file, inline <br> Default: file |

## Notes

Installing Lua is **not** part of this extension. <br>
Furthermore, the task requires the use of the `lua` command.

Thus, you are responsible for the Lua installation and that the `lua` command can be accessed.

## Main Dependencies
- [Azure DevOps Extension SDK](https://github.com/microsoft/azure-devops-extension-sdk)
- [Azure Pipelines Task Lib](https://github.com/microsoft/azure-pipelines-task-lib)

## Credits
- Icon by [lua.org](https://www.lua.org/images/) / [lua-users.org](http://lua-users.org/wiki/LuaLogo)