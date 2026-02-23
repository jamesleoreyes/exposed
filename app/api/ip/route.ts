import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  let ip = forwarded?.split(",")[0]?.trim() ?? realIp ?? "unknown";

  // Strip IPv6-mapped IPv4 prefix
  if (ip.startsWith("::ffff:")) {
    ip = ip.slice(7);
  }

  const isLocal =
    ip === "unknown" ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.");

  return NextResponse.json({
    ip: isLocal ? "127.0.0.1" : ip,
  });
}
