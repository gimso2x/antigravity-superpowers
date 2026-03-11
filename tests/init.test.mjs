import { mkdtemp, mkdir, rm, access, readFile, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import test from "node:test";
import assert from "node:assert/strict";

import { initCommand } from "../src/commands/init.js";

const cliPath = resolve(
  process.cwd(),
  "bin/antigravity-super-ssuk.js",
);

async function pathExists(path) {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function runCli(args, cwd) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
}

async function createTempProject(prefix) {
  const baseTmp = tmpdir();
  await mkdir(baseTmp, { recursive: true });
  return mkdtemp(join(baseTmp, prefix));
}

// stdout/stderr 캡처를 위한 헬퍼
function createBufferedIO(cwd, homedir) {
  const chunks = { stdout: [], stderr: [] };
  return {
    io: {
      cwd,
      stdout: { write: (s) => chunks.stdout.push(s) },
      stderr: { write: (s) => chunks.stderr.push(s) },
      homedir,
    },
    chunks,
  };
}

test("init creates .agent in a fresh project", async () => {
  const projectDir = await createTempProject("agsp-fresh-");

  try {
    const result = runCli(["init"], projectDir);
    assert.equal(result.status, 0);

    const hasAgent = await pathExists(join(projectDir, ".agent", "AGENTS.md"));
    assert.equal(hasAgent, true);
  } finally {
    await rm(projectDir, { recursive: true, force: true });
  }
});

test("init fails when .agent exists without --force", async () => {
  const projectDir = await createTempProject("agsp-existing-");

  try {
    await mkdir(join(projectDir, ".agent"), { recursive: true });

    const result = runCli(["init"], projectDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /already exists/i);
    assert.match(result.stderr, /--force/i);
  } finally {
    await rm(projectDir, { recursive: true, force: true });
  }
});

test("init replaces .agent with --force", async () => {
  const projectDir = await createTempProject("agsp-force-");

  try {
    await mkdir(join(projectDir, ".agent"), { recursive: true });

    const result = runCli(["init", "--force"], projectDir);
    assert.equal(result.status, 0);

    const hasTemplate = await pathExists(join(projectDir, ".agent", "AGENTS.md"));
    assert.equal(hasTemplate, true);
  } finally {
    await rm(projectDir, { recursive: true, force: true });
  }
});

// --- GEMINI.md 글로벌 룰 설치 테스트 ---

test("init installs GEMINI.md to ~/.gemini/", async () => {
  const projectDir = await createTempProject("agsp-gemini-");
  const fakeHome = await createTempProject("agsp-home-");

  try {
    const { io } = createBufferedIO(projectDir, fakeHome);
    const exitCode = await initCommand([], io);
    assert.equal(exitCode, 0);

    const geminiPath = join(fakeHome, ".gemini", "GEMINI.md");
    const hasGemini = await pathExists(geminiPath);
    assert.equal(hasGemini, true, "GEMINI.md should be installed");
  } finally {
    await rm(projectDir, { recursive: true, force: true });
    await rm(fakeHome, { recursive: true, force: true });
  }
});

test("init skips GEMINI.md when it already exists without --force", async () => {
  const projectDir = await createTempProject("agsp-gemini-skip-");
  const fakeHome = await createTempProject("agsp-home-skip-");

  try {
    // 기존 GEMINI.md 생성
    const geminiDir = join(fakeHome, ".gemini");
    await mkdir(geminiDir, { recursive: true });
    const geminiPath = join(geminiDir, "GEMINI.md");
    await writeFile(geminiPath, "# 기존 룰", "utf8");

    const { io, chunks } = createBufferedIO(projectDir, fakeHome);
    const exitCode = await initCommand([], io);
    assert.equal(exitCode, 0);

    // 기존 파일이 유지되어야 함
    const content = await readFile(geminiPath, "utf8");
    assert.equal(content, "# 기존 룰");

    // "already exist" 메시지가 출력되어야 함
    const output = chunks.stdout.join("");
    assert.match(output, /already exist/i);
  } finally {
    await rm(projectDir, { recursive: true, force: true });
    await rm(fakeHome, { recursive: true, force: true });
  }
});

test("init replaces GEMINI.md with --force", async () => {
  const projectDir = await createTempProject("agsp-gemini-force-");
  const fakeHome = await createTempProject("agsp-home-force-");

  try {
    // 기존 GEMINI.md 생성
    const geminiDir = join(fakeHome, ".gemini");
    await mkdir(geminiDir, { recursive: true });
    const geminiPath = join(geminiDir, "GEMINI.md");
    await writeFile(geminiPath, "# 기존 룰", "utf8");

    const { io } = createBufferedIO(projectDir, fakeHome);
    const exitCode = await initCommand(["--force"], io);
    assert.equal(exitCode, 0);

    // 파일이 교체되어야 함
    const content = await readFile(geminiPath, "utf8");
    assert.notEqual(content, "# 기존 룰", "GEMINI.md should be replaced with template");
  } finally {
    await rm(projectDir, { recursive: true, force: true });
    await rm(fakeHome, { recursive: true, force: true });
  }
});
