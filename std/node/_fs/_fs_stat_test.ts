// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

import { fail, assertEquals } from "../../testing/asserts.ts";
import { join } from "../../path/mod.ts";

import { lstat, lstatSync, stat, statSync } from "./_fs_stat.ts";

Deno.test("lstat", async function () {
  const tmpDir = Deno.makeTempDirSync();
  const tmpLink = join(tmpDir, "link");
  Deno.symlinkSync(tmpDir, tmpLink, { type: "dir" });

  await new Promise((resolve, reject) => {
    lstat(tmpDir, (err, stats) => {
      try {
        assertEquals(err, null);

        if (!stats) {
          fail("stats was unexpectedly falsy");
          throw "unreachable";
        }

        assertEquals(stats.isDirectory(), true);
        assertEquals(stats.isFile(), false);
        assertEquals(stats.isSymbolicLink(), false);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

  await new Promise((resolve, reject) => {
    lstat(tmpLink, (err, stats) => {
      try {
        assertEquals(err, null);

        if (!stats) {
          fail("stats was unexpectedly falsy");
          throw "unreachable";
        }

        assertEquals(stats.isDirectory(), false);
        assertEquals(stats.isFile(), false);
        assertEquals(stats.isSymbolicLink(), true);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

  Deno.removeSync(tmpDir, { recursive: true });
});

Deno.test("lstatSync", function () {
  const tmpDir = Deno.makeTempDirSync();
  const tmpLink = join(tmpDir, "link");
  Deno.symlinkSync(tmpDir, tmpLink, { type: "dir" });

  {
    const stats = lstatSync(tmpDir);

    assertEquals(stats.isDirectory(), true);
    assertEquals(stats.isFile(), false);
    assertEquals(stats.isSymbolicLink(), false);
  }

  {
    const stats = lstatSync(tmpLink);

    assertEquals(stats.isDirectory(), false);
    assertEquals(stats.isFile(), false);
    assertEquals(stats.isSymbolicLink(), true);
  }

  Deno.removeSync(tmpDir, { recursive: true });
});

Deno.test("stat", async function () {
  const tmpDir = Deno.makeTempDirSync();
  const tmpLink = join(tmpDir, "link");
  Deno.symlinkSync(tmpDir, tmpLink, { type: "dir" });

  await new Promise((resolve, reject) => {
    stat(tmpDir, (err, stats) => {
      try {
        assertEquals(err, null);

        if (!stats) {
          fail("stats was unexpectedly falsy");
          throw "unreachable";
        }

        assertEquals(stats.isDirectory(), true);
        assertEquals(stats.isFile(), false);
        assertEquals(stats.isSymbolicLink(), false);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

  await new Promise((resolve, reject) => {
    stat(tmpLink, (err, stats) => {
      try {
        assertEquals(err, null);

        if (!stats) {
          fail("stats was unexpectedly falsy");
          throw "unreachable";
        }

        assertEquals(stats.isDirectory(), true);
        assertEquals(stats.isFile(), false);
        assertEquals(stats.isSymbolicLink(), false);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

  Deno.removeSync(tmpDir, { recursive: true });
});

Deno.test("statSync", function () {
  const tmpDir = Deno.makeTempDirSync();
  const tmpLink = join(tmpDir, "link");
  Deno.symlinkSync(tmpDir, tmpLink, { type: "dir" });

  {
    const stats = statSync(tmpDir);

    assertEquals(stats.isDirectory(), true);
    assertEquals(stats.isFile(), false);
    assertEquals(stats.isSymbolicLink(), false);
  }

  {
    const stats = statSync(tmpLink);

    assertEquals(stats.isDirectory(), true);
    assertEquals(stats.isFile(), false);
    assertEquals(stats.isSymbolicLink(), false);
  }

  Deno.removeSync(tmpDir, { recursive: true });
});
