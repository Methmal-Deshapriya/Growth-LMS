"use client";

import React from "react";

/**
 * Tracks which registered section id is currently most in-view, so a
 * fixed/sticky companion widget (rendered elsewhere in the tree) can react
 * to it. Sections register themselves by rendering <SectionAnchor id="..."/>.
 */
type Listener = (id: string) => void;

const listeners = new Set<Listener>();
let current = "hero";

function notify(id: string) {
  if (id === current) return;
  current = id;
  listeners.forEach((l) => l(id));
}

export function SectionAnchor({ id }: { id: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) notify(id);
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  return <div ref={ref} aria-hidden="true" className="absolute top-1/2 h-px w-px" />;
}

export function useActiveSection() {
  const [id, setId] = React.useState(current);

  React.useEffect(() => {
    listeners.add(setId);
    return () => {
      listeners.delete(setId);
    };
  }, []);

  return id;
}
