# Exposed

See what a single webpage knows about you.

Exposed is an educational browser fingerprinting tool that reveals your digital identity in plain English. No login, no cookies, no permissions. Just a page load. Every data point is presented as a human-readable finding so anyone can understand what's being collected and why it matters.

## What it collects

Exposed demonstrates 12 categories of browser fingerprinting:

| Category | What it reveals |
|---|---|
| **Network & Location** | IP address, with opt-in geolocation lookup |
| **Browser & OS** | Browser, version, operating system, language preferences |
| **Hardware Profile** | CPU cores, memory, screen resolution, GPU |
| **Canvas Fingerprint** | Unique rendering signature from invisible drawn shapes |
| **WebGL Fingerprint** | Graphics card signature via WebGL introspection |
| **Audio Fingerprint** | Unique audio processing characteristics |
| **Font Detection** | Installed fonts detected via silent measurement |
| **Timezone & Locale** | Timezone, locale, number/date/currency formatting |
| **Storage & Tracking** | Supported tracking mechanisms (cookies, localStorage, etc.) |
| **Permissions** | Browser permission states |
| **Media Devices** | Count of connected cameras, microphones, speakers |
| **Behavioral Signals** | Real-time mouse movement, clicks, keystrokes, scroll depth |

All data is processed locally in your browser. The only external request is an optional IP geolocation lookup via [ip-api.com](https://ip-api.com), and the app asks for your consent before making it.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com)
- [Motion](https://motion.dev) (animations)

## Privacy

- All fingerprinting runs client-side in your browser
- No data is stored, logged, or sent to any server
- The only external API call (IP geolocation via ip-api.com) is opt-in with full disclosure
- No analytics, no tracking scripts, no third-party resources

## Disclaimer

This project is for educational and fun purposes only. It was entirely 100% vibe coded.

## License

[MIT](LICENSE)
