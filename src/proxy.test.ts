import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

function request(path: string, token?: string) {
  return new NextRequest(`https://academy.example${path}`, {
    headers: token ? { cookie: `token=${token}` } : undefined,
  });
}

describe("dashboard proxy boundaries", () => {
  it("allows unauthenticated visitors to verify a public certificate", () => {
    const response = proxy(request("/certificates/verify/DOES-NOT-EXIST"));

    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("location")).toBeNull();
  });

  it("still redirects the private certificate index to sign-in", () => {
    const response = proxy(request("/certificates"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://academy.example/?slide=auth",
    );
  });

  it("allows an authenticated learner to open private certificate pages", () => {
    const response = proxy(request("/certificates", "signed-token"));

    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
