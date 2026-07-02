import Link from "next/link";
import { TriageReviewer } from "@/components/triage/TriageReviewer";
import { Header } from "@/components/ui/Header";

export default function HomePage() {
  return (
    <main className="app-shell flex flex-col h-screen overflow-hidden">
      <div className="mesh-background" aria-hidden />
      <div className="orbital-ring" aria-hidden />

      <Header />

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-12 w-full relative z-10 custom-scrollbar">
        <section className="mx-auto mb-8 max-w-[1600px] pt-4">
          <div className="stagger-in stagger-2 max-w-4xl">
            <p className="eyebrow">AI incident operations console</p>
            <h1 className="hero-title mt-4 max-w-4xl text-4xl font-semibold sm:text-5xl lg:text-6xl">
              Triage messy incident queues with <span className="gradient-text">living intelligence.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-secondary sm:text-lg">
              Classify incoming reports, surface security risk, explain urgency, and route work to the right owner while the reasoning streams in live.
            </p>
          </div>
        </section>

        <div className="stagger-in stagger-3 mx-auto max-w-[1600px]">
          <TriageReviewer />
        </div>
      </div>
    </main>
  );
}
