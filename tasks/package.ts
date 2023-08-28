import { task } from "hardhat/config";
import { rimraf } from "rimraf";
import { resolve } from "path";
import {
  cpSync,
  mkdirSync,
  readdirSync,
  lstatSync,
  readFileSync,
  writeFileSync,
} from "fs";

export function getFiles(path: string) {
  const paths = readdirSync(path);
  const results = paths.map((file) => {
    return {
      file,
      isDirectory: lstatSync(resolve(path, file)).isDirectory(),
    };
  });

  const files: string[] = [];
  for (const result of results) {
    if (result.isDirectory) {
      const subfiles = getFiles(resolve(path, result.file));
      for (const subfile of subfiles) {
        files.push(subfile);
      }
    } else {
      files.push(resolve(path, result.file));
    }
  }

  return files;
}

task("package", "Builds the npm package").setAction(async () => {
  const dist = resolve(__dirname, "../dist");
  await rimraf(dist);
  mkdirSync(dist);

  const types = resolve(__dirname, "../typechain-types");
  const artifacts = resolve(__dirname, "../artifacts/contracts");

  cpSync(types, dist, { recursive: true });

  const artifacs = getFiles(artifacts).filter(
    (path) => !path.endsWith(".dbg.json")
  );

  const abi = resolve(__dirname, "../abi");
  await rimraf(abi);
  mkdirSync(abi);

  for (const path of artifacs) {
    const filename = path.split("/").pop()!;
    const artifact = JSON.parse(readFileSync(path, "utf-8"));
    writeFileSync(
      resolve(abi, filename),
      JSON.stringify(artifact.abi, null, 2),
      "utf-8"
    );
  }
});
