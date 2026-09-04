import { expect, test, vi } from "vitest";

const git = vi.hoisted(() => ({
  exec: vi.fn(async () => 0),
  getExecOutput: vi.fn(async () => ({
    exitCode: 2,
    stdout: "",
    stderr: "",
  })),
}));

vi.mock("@actions/exec", () => git);

test("publishes an already-built v3 release to the v3 release line", async () => {
  await import("./release.ts");

  await vi.waitFor(() => {
    expect(git.exec).toHaveBeenCalledWith("git", [
      "commit",
      "--allow-empty",
      "-m",
      "v3.0.0",
    ]);
    expect(git.exec).toHaveBeenCalledWith("git", [
      "push",
      "--force",
      "--follow-tags",
      "origin",
      "HEAD:refs/heads/v3",
    ]);
  });
});
