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

  if (isLocal) {
    return NextResponse.json({
      ip: ip === "unknown" ? "127.0.0.1" : ip,
      city: "Localhost",
      region: "Development",
      country: "Local",
      isp: "Local Network",
      lat: 0,
      lon: 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }

  try {
    // ip-api.com: free, no key needed, 45 req/min
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp,lat,lon,timezone`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();

    if (data.status === "fail") {
      return NextResponse.json({
        ip,
        city: "Unknown",
        region: "Unknown",
        country: "Unknown",
        isp: "Unknown",
        lat: 0,
        lon: 0,
        timezone: null,
      });
    }

    return NextResponse.json({
      ip,
      city: data.city ?? "Unknown",
      region: data.regionName ?? "Unknown",
      country: data.country ?? "Unknown",
      isp: data.isp ?? "Unknown",
      lat: data.lat ?? 0,
      lon: data.lon ?? 0,
      timezone: data.timezone ?? null,
    });
  } catch {
    return NextResponse.json({
      ip,
      city: "Unknown",
      region: "Unknown",
      country: "Unknown",
      isp: "Unknown",
      lat: 0,
      lon: 0,
      timezone: null,
    });
  }
}
