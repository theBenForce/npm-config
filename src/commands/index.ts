import { Command } from "commander";
import saveNpmConfigCommand from "./saveConfig";
import listConfigsCommand from "./listConfigs";
import viewConfigCommand from "./viewConfig";
import { loadNpmConfigCommand } from "./loadConfig";
import { editScriptCommand } from "./editScript";
import { viewScriptCommand } from "./viewScript";



export const addCommands = (program: Command): Command => 
    program
        .addCommand(saveNpmConfigCommand)
        .addCommand(listConfigsCommand)
        .addCommand(viewConfigCommand)
        .addCommand(loadNpmConfigCommand)
        .addCommand(editScriptCommand)
        .addCommand(viewScriptCommand);