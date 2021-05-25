import { EOL } from 'os';
import * as yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';
import { findUnusedTypes } from './find-unused-types';

type CliArgs = {
  dir: string;
};

function ensureExists(fileOrDir: string): void {
  if (!fs.existsSync(fileOrDir)) {
    throw new Error(`file or directory ${fileOrDir} does not exist`);
  }
}

function prettyOutput({
  hasBuiltinTypes,
  notInDeps,
}: {
  notInDeps: readonly string[];
  hasBuiltinTypes: readonly string[];
}): void {
  if (hasBuiltinTypes.length + notInDeps.length > 0) {
    process.stdout.write(`The following types may not be used:${EOL}`);
  } else {
    process.stdout.write('all good!');
  }
  if (hasBuiltinTypes.length > 0) {
    process.stdout.write(`Because there is buildin types:${EOL}`);
    process.stdout.write(
      hasBuiltinTypes.map((t) => `\t- ${t}`).join(EOL) + EOL,
    );
    process.stdout.write(EOL);
  }
  if (notInDeps.length > 0) {
    process.stdout.write(`Because the corresponding deps is not used:${EOL}`);
    process.stdout.write(notInDeps.map((t) => `\t- ${t}`).join(EOL) + EOL);
  }
}

function handler({ dir }: CliArgs) {
  ensureExists(dir);
  ensureExists(path.join(dir, 'package.json'));
  ensureExists(path.join(dir, 'node_modules'));
  const unusedTypes = findUnusedTypes(dir);
  prettyOutput(unusedTypes);
}

function main() {
  yargs
    .command('$0 <dir>', 'collect tsc errors from bazel output', {
      builder: () =>
        yargs.positional('dir', {
          describe: 'to collect errors from',
          type: 'string',
          demandOption: true,
        }),
      handler,
    })
    .strict(true)
    .exitProcess(true)
    .showHelpOnFail(false, 'Specify --help for available options')
    .help()
    .parse();
}

main();
