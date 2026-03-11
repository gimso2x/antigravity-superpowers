import { access, cp, mkdir, rm, stat } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";
import { homedir as osHomedir } from "node:os";

function getTemplateDir() {
  return fileURLToPath(new URL("../../templates/.agent", import.meta.url));
}

function getGeminiTemplateFile() {
  return fileURLToPath(new URL("../../templates/GEMINI.md", import.meta.url));
}

async function exists(path) {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function parseInitArgs(args) {
  const parsed = {
    target: ".",
    force: false,
    global: false,
  };
  let targetSet = false;

  for (const arg of args) {
    if (arg === "--force" || arg === "-f") {
      parsed.force = true;
      continue;
    }

    if (arg === "--global" || arg === "-g") {
      parsed.global = true;
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option for init: ${arg}`);
    }

    if (targetSet) {
      throw new Error("Too many positional arguments. Only one target directory is supported.");
    }

    parsed.target = arg;
    targetSet = true;
  }

  return parsed;
}

async function validateTargetDir(targetDir) {
  let targetStat;
  try {
    targetStat = await stat(targetDir);
  } catch {
    throw new Error(`Target directory does not exist: ${targetDir}`);
  }

  if (!targetStat.isDirectory()) {
    throw new Error(`Target path is not a directory: ${targetDir}`);
  }
}

export async function initCommand(args, { cwd, stdout, stderr, homedir }) {
  let parsed;
  try {
    parsed = parseInitArgs(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    stderr.write(`${message}\n`);
    return 1;
  }

  const home = homedir ?? osHomedir();
  const targetDir = parsed.global ? home : resolve(cwd, parsed.target);
  const agentDir = join(targetDir, ".agent");
  const templateDir = getTemplateDir();

  try {
    if (!parsed.global) {
      await validateTargetDir(targetDir);
    }

    const templateExists = await exists(templateDir);
    if (!templateExists) {
      throw new Error(
        "Bundled template is missing. Run `npm run sync:template` before using init from source.",
      );
    }

    const agentExists = await exists(agentDir);
    if (agentExists && !parsed.force) {
      const location = parsed.global ? "Global" : "Local";
      stderr.write(
        `${location} .agent already exists at ${agentDir}. Re-run with --force to replace it.\n`,
      );
      return 1;
    }

    if (agentExists && parsed.force) {
      await rm(agentDir, { recursive: true, force: true });
    }

    await cp(templateDir, agentDir, { recursive: true });

    const msg = parsed.global
      ? `Initialized Global Antigravity Superpowers profile at ${agentDir}`
      : `Initialized Antigravity Superpowers profile at ${agentDir}`;
    stdout.write(`${msg}\n`);

    // GEMINI.md 글로벌 룰 설치
    await installGeminiGlobalRules({ stdout, force: parsed.force, homedir });

    if (!parsed.global) {
      stdout.write("Next step: bash .agent/tests/run-tests.sh\n");
    }
    stdout.write(
      "Note: docs/plans/task.md is created at runtime by skills when task tracking starts.\n",
    );
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    stderr.write(`Init failed: ${message}\n`);
    return 1;
  }
}

async function installGeminiGlobalRules({ stdout, force, homedir }) {
  const home = homedir ?? osHomedir();
  const geminiDir = join(home, ".gemini");
  const geminiFile = join(geminiDir, "GEMINI.md");
  const templateFile = getGeminiTemplateFile();

  const templateFileExists = await exists(templateFile);
  if (!templateFileExists) {
    // 번들에 GEMINI.md가 없으면 조용히 건너뜀
    return;
  }

  await mkdir(geminiDir, { recursive: true });

  const geminiExists = await exists(geminiFile);
  if (geminiExists && !force) {
    stdout.write(`Global rules already exist at ${geminiFile} (use --force to replace).\n`);
    return;
  }

  await cp(templateFile, geminiFile);
  stdout.write(`Installed global rules at ${geminiFile}\n`);
}
