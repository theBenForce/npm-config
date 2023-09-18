import { select } from "@inquirer/prompts";
import { ConfigRecord, ScriptTypes } from "../controller/db";

export const getScriptName = async (
  _config: ConfigRecord,
  name?: string
): Promise<ScriptTypes> => {
  return (name ||
    (await select({
      message: "Select a script to load",
      choices: Object.values(ScriptTypes).map((type) => ({
        name: type,
        value: type,
      })),
    }))) as ScriptTypes;
};
