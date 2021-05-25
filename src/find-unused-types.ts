import * as path from 'path';
import * as fs from 'fs';

// @types/xxx -> xxx
function findTypes(deps: ReadonlySet<string>): Set<string> {
  const prefix = '@types/';
  const types = [...deps]
    .filter((dep) => dep.startsWith(prefix))
    .map((dep) => dep.slice(prefix.length));
  return new Set(types);
}

function readPackageJSON(dir: string) {
  const packageJSONContent = fs.readFileSync(path.join(dir, 'package.json'), {
    encoding: 'utf-8',
  });
  const packageJSON = JSON.parse(packageJSONContent);
  return packageJSON;
}

function findTypesNotInDeps({
  types,
  deps,
}: {
  types: ReadonlySet<string>;
  deps: ReadonlySet<string>;
}): string[] {
  return [...types].filter((type) => !deps.has(type));
}

function findDepsHasBuiltinTypes(
  types: ReadonlySet<string>,
  nodeModulesDir: string,
): string[] {
  return [...types].filter((type) => {
    if (!fs.existsSync(path.join(nodeModulesDir, type))) {
      // This is taken cared by findTypesNotInDeps
      return false;
    }
    const packageJSON = readPackageJSON(path.join(nodeModulesDir, type));
    return typeof packageJSON.types === 'string';
  });
}

export function findUnusedTypes(dir: string): {
  notInDeps: string[];
  hasBuiltinTypes: string[];
} {
  const packageJSON = readPackageJSON(dir);
  const deps = new Set([
    ...Object.keys(packageJSON.devDependencies ?? {}),
    ...Object.keys(packageJSON.dependencies ?? {}),
  ]);
  const types = findTypes(deps);

  const typesNotInDeps = findTypesNotInDeps({ types, deps });
  const typesHasBuiltInTypes = findDepsHasBuiltinTypes(
    types,
    path.join(dir, 'node_modules'),
  );
  return {
    notInDeps: typesNotInDeps,
    hasBuiltinTypes: typesHasBuiltInTypes,
  };
}
