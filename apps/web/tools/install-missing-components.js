import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";

const APP_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const COMPONENTS_JSON_FILE = "components.json";
const PACKAGE_JSON_FILE = "package.json";
const TAILWIND_CONFIG_FILE = "tailwind.config.js";
const INDEX_CSS_FILE = "src/index.css";
const FILES_UPDATED_BY_SHADCN_INIT = [
  PACKAGE_JSON_FILE,
  COMPONENTS_JSON_FILE,
  TAILWIND_CONFIG_FILE,
  INDEX_CSS_FILE,
];

const JSX_EXTENSION = "jsx";
const JS_EXTENSION = "js";

const COMPONENT_NAME_TO_INSTALLABLE_COMPONENT_NAME_MAP = {
  toaster: "toast",
  "use-toast": "toast",
};

async function run() {
  let stdout = "";
  let error = null;
  const updatedFiles = [];

  try {
    process.chdir(APP_DIR);

    // Get a list of components that are imported but not installed
    const uniqueComponentNames = await findImportedComponentNames();
    const missingMask = await Promise.all(
      uniqueComponentNames.map((name) =>
        componentExists(name).then((exists) => !exists),
      ),
    );
    const missingComponentNames = uniqueComponentNames.filter(
      (_, i) => missingMask[i],
    );
    const installableComponentNames = [
      ...new Set(
        missingComponentNames.map(
          (name) =>
            COMPONENT_NAME_TO_INSTALLABLE_COMPONENT_NAME_MAP[name] ?? name,
        ),
      ),
    ];

    // If the components.json file doesn't exist, initialize shadcn
    const componentsJsonPath = path.join(APP_DIR, COMPONENTS_JSON_FILE);
    const componentsJsonExists = await pathExists(componentsJsonPath);

    if (!componentsJsonExists) {
      const shadcnInitResult = await runCommand(
        "npx -y shadcn@latest init -f -b neutral --src-dir",
      );

      stdout = [shadcnInitResult.stdout, shadcnInitResult.stderr]
        .filter(Boolean)
        .join("\n");

      const isErrorStatus = !!shadcnInitResult.status;

      if (isErrorStatus) {
        error = "Shadcn init failed";
      } else {
        updatedFiles.push(...FILES_UPDATED_BY_SHADCN_INIT);
      }
    }

    // If there are installable components, install them
    if (installableComponentNames.length && !error) {
      const shadcnAddResult = await runCommand(
        `npx -y shadcn@latest add ${installableComponentNames.join(" ")} -y -o --src-dir`,
      );

      const shadcnAddOutput = [shadcnAddResult.stdout, shadcnAddResult.stderr]
        .filter(Boolean)
        .join("\n");

      stdout = stdout ? `${stdout}\n${shadcnAddOutput}` : shadcnAddOutput;

      const isErrorStatus = !!shadcnAddResult.status;

      if (isErrorStatus) {
        error = "Shadcn add failed";
      } else {
        // Example output of shadcnAddOutput:
        //   - src/components/ui/button.tsx
        //   - src/components/ui/input.tsx
        // The code below extracts these file paths like this: src/components/ui/button.tsx, src/components/ui/input.tsx
        const filesUpdatedByShadcnAdd = shadcnAddOutput
          .split("\n")
          .flatMap((line) => {
            const match = line.match(/^\s*-\s*(src\/\S+)/);
            return match ? [match[1].trim()] : [];
          });

        updatedFiles.push(...filesUpdatedByShadcnAdd);
      }
    }
  } catch (err) {
    error = error ?? err?.message ?? "unknown error";
  }

  const uniqueUpdatedFiles = [...new Set(updatedFiles)];

  const result = {
    stdout: stdout,
    error: error,
    updatedFiles: uniqueUpdatedFiles,
  };

  console.log(JSON.stringify(result));
}

async function runCommand(command) {
  try {
    const { stdout, stderr } = await promisify(exec)(command);

    return {
      stdout: stdout ?? "",
      stderr: stderr ?? "",
      status: 0,
    };
  } catch (error) {
    return {
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? "",
      status: error.code ?? 1,
    };
  }
}

async function pathExists(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function scanDirectoryForUiImports(directoryPath) {
  const componentNames = new Set();
  const entries = await fs.promises.readdir(directoryPath, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullEntryPath = path.join(directoryPath, entry.name);
    const isDirectory = entry.isDirectory();

    if (isDirectory) {
      const innerDirectoryComponentNames =
        await scanDirectoryForUiImports(fullEntryPath);

      for (const name of innerDirectoryComponentNames) {
        componentNames.add(name);
      }
    }

    const isJsxFile = entry.name.endsWith(`.${JSX_EXTENSION}`);

    if (isJsxFile) {
      try {
        const fileContent = await fs.promises.readFile(fullEntryPath, "utf8");

        for (const [, componentName] of fileContent.matchAll(
          /@\/components\/ui\/([a-z0-9-]+)/g,
        )) {
          componentNames.add(componentName);
        }
      } catch {
        // Skip unreadable files
      }
    }
  }

  return componentNames;
}

async function findImportedComponentNames() {
  const srcPath = path.join(APP_DIR, "src");
  const srcExists = await pathExists(srcPath);

  if (!srcExists) {
    return [];
  }

  const uniqueComponentNames = await scanDirectoryForUiImports(srcPath);

  return [...uniqueComponentNames];
}

async function componentExists(componentName) {
  const componentsUiPath = path.join(APP_DIR, "src", "components", "ui");
  const hooksPath = path.join(APP_DIR, "src", "hooks");

  const existenceChecks = await Promise.all(
    [JSX_EXTENSION, JS_EXTENSION].map(async (extension) => {
      const fileName = `${componentName}.${extension}`;

      return (
        (await pathExists(path.join(componentsUiPath, fileName))) ||
        (await pathExists(path.join(hooksPath, fileName)))
      );
    }),
  );

  return existenceChecks.some(Boolean);
}

run();
