import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

export function makeRequestId(): string {
  return `req_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

export function okResponse<T>(data: T, status = 200, headers?: HeadersInit) {
  return NextResponse.json(
    {
      success: true,
      data,
      requestId: makeRequestId(),
    },
    { status, headers }
  );
}

export function errResponse(code: string, message: string, status = 400, headers?: HeadersInit) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: { code, message },
      message,
      requestId: makeRequestId(),
    },
    { status, headers }
  );
}
