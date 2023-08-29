import { Command } from "commander";
import saveNpmConfigCommand from "./saveConfig";
import listConfigsCommand from "./listConfigs";
import viewConfigCommand from "./viewConfig";
import { loadNpmConfigCommand } from "./loadConfig";
import { editScriptCommand } from "./editScript";
import { viewScriptCommand } from "./viewScript";
import { editConfigCommand } from "./editConfig";



export const addCommands = (program: Command): Command => 
    program
        .addCommand(listConfigsCommand)
        .addCommand(saveNpmConfigCommand)
        .addCommand(viewConfigCommand)
        .addCommand(editConfigCommand)
        .addCommand(loadNpmConfigCommand)
        .addCommand(editScriptCommand)
        .addCommand(viewScriptCommand);