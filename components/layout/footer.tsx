export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="max-w-lg text-sm text-muted-foreground">
            Everything you just saw was collected by a single webpage. No login.
            No cookies accepted. No data is stored. The only external request is
            the optional IP geolocation lookup, and we asked before making it.
          </p>
          <p className="text-sm text-foreground/70">
            Now imagine what sites that <em>do</em> store your data can build.
          </p>
          <div className="mt-2 h-px w-16 bg-border" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
            Built for educational awareness
          </p>
        </div>
      </div>
    </footer>
  );
}
