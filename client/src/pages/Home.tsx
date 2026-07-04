import { Link } from "react-router-dom";
import { Button } from "#components/ui/button";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 gap-12 pb-8">

      {/* Hero */}
      <div className="flex flex-col items-center gap-4 text-center max-w-xl">
        <h1 className="text-5xl font-bold">Track your bills, stress less</h1>
        <p className="text-muted-foreground text-lg">
          BillMind keeps all your recurring bills in one place so nothing slips through the cracks.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
        {[
          { title: "Never miss a bill", desc: "Get a clear view of every upcoming payment." },
          { title: "All in one place", desc: "No more juggling emails, apps, and sticky notes." },
          { title: "Simple and fast", desc: "Add a bill in seconds. No clutter, no confusion." },
        ].map(({ title, desc }) => (
          <div key={title} className="rounded-xl border p-6 flex flex-col gap-2">
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-muted-foreground text-sm">{desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}