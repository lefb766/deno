// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

import { fromFileUrl } from "../path.ts";
import { notImplemented } from "../_utils.ts";

export class Stats {
  constructor(private _fileInfo: Deno.FileInfo) {
    this.dev = _fileInfo.dev;
    this.ino = _fileInfo.ino;
    this.mode = _fileInfo.mode;
    this.nlink = _fileInfo.nlink;
    this.uid = _fileInfo.uid;
    this.gid = _fileInfo.gid;
    this.rdev = _fileInfo.rdev;
    this.size = _fileInfo.size;
    this.blksize = _fileInfo.blksize;
    this.blocks = _fileInfo.blocks;
    this.atimeMs = _fileInfo.atime?.valueOf() || null;
    this.mtimeMs = _fileInfo.mtime?.valueOf() || null;
    this.ctimeMs = null;
    this.birthtimeMs = _fileInfo.birthtime?.valueOf() || null;
    this.atime = _fileInfo.atime;
    this.mtime = _fileInfo.mtime;
    this.ctime = null;
    this.birthtime = _fileInfo.birthtime;
  }

  isBlockDevice(): boolean {
    throw notImplemented("stats.isBlockDevice()");
  }
  isCharacterDevice(): boolean {
    throw notImplemented("stats.isCharacterDevice()");
  }
  isDirectory(): boolean {
    return this._fileInfo.isDirectory;
  }
  isFIFO(): boolean {
    throw notImplemented("stats.isFIFO()");
  }
  isFile(): boolean {
    return this._fileInfo.isFile;
  }
  isSocket(): boolean {
    throw notImplemented("stats.isSocket()");
  }
  isSymbolicLink(): boolean {
    return this._fileInfo.isSymlink;
  }

  // Unlike Node.js's Stats, Deno's FileInfo can omit most of properties
  // depending on the platform it is running on.
  // This type definition aims to reflect such implementation limit
  // rather than to serve as a parity with Node.js.
  dev: number | null;
  ino: number | null;
  mode: number | null;
  nlink: number | null;
  uid: number | null;
  gid: number | null;
  rdev: number | null;
  size: number;
  blksize: number | null;
  blocks: number | null;
  atimeMs: number | null;
  mtimeMs: number | null;
  ctimeMs: null; // not available in FileInfo
  birthtimeMs: number | null;
  atime: Date | null;
  mtime: Date | null;
  ctime: null; // not available in FileInfo
  birthtime: Date | null;
}

type StatsOptions = { bigint?: boolean };
type StatsCallback = (err: Error | null, data?: Stats) => void;

export function lstat(path: string | URL, callback: StatsCallback): void;
export function lstat(
  path: string | URL,
  options: StatsOptions,
  callback: StatsCallback,
): void;
export function lstat(
  path: string | URL,
  optionsOrCallback?: StatsOptions | StatsCallback,
  callback?: StatsCallback,
) {
  path = path instanceof URL ? fromFileUrl(path) : path;
  let options: StatsOptions = {};
  let cb: StatsCallback;
  if (typeof optionsOrCallback === "function") {
    cb = optionsOrCallback;
  } else if (typeof optionsOrCallback === "object") {
    options = optionsOrCallback;
    if (typeof callback === "function") {
      cb = callback;
    } else {
      throw new Error("callback is required but not given");
    }
  }

  checkOptions(options);

  Deno.lstat(path)
    .then((fileInfo) => {
      const stats = new Stats(fileInfo);
      cb(null, stats);
    })
    .catch((e) => {
      cb(e);
    });
}

export function lstatSync(path: string | URL, options?: StatsOptions): Stats {
  checkOptions(options);
  path = path instanceof URL ? fromFileUrl(path) : path;
  const fileInfo = Deno.lstatSync(path);
  return new Stats(fileInfo);
}

export function stat(path: string | URL, callback: StatsCallback): void;
export function stat(
  path: string | URL,
  options: StatsOptions,
  callback: StatsCallback,
): void;
export function stat(
  path: string | URL,
  optionsOrCallback?: StatsOptions | StatsCallback,
  callback?: StatsCallback,
) {
  path = path instanceof URL ? fromFileUrl(path) : path;
  let options: StatsOptions = {};
  let cb: StatsCallback;
  if (typeof optionsOrCallback === "function") {
    cb = optionsOrCallback;
  } else if (typeof optionsOrCallback === "object") {
    options = optionsOrCallback;
    if (typeof callback === "function") {
      cb = callback;
    } else {
      throw new Error("callback is required but not given");
    }
  }

  checkOptions(options);

  Deno.stat(path)
    .then((fileInfo) => {
      const stats = new Stats(fileInfo);
      cb(null, stats);
    })
    .catch((e) => {
      cb(e);
    });
}

export function statSync(path: string | URL, options?: StatsOptions): Stats {
  checkOptions(options);
  path = path instanceof URL ? fromFileUrl(path) : path;
  const fileInfo = Deno.statSync(path);
  return new Stats(fileInfo);
}

function checkOptions(options: StatsOptions | undefined): void {
  if (options && options.bigint) {
    throw notImplemented(
      "stat with options `{ bigint: true }` is not supported",
    );
  }
}
