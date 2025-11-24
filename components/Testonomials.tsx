"use client";
import { CardStack } from "./ui/card-stack";
import { Highlight } from "./Highlight";
export function CardStackDemo() {
  return (
    <div className="h-full flex items-center justify-center  w-full">
      <CardStack items={CARDS} />
    </div>
  );
}

// Small utility to highlight the content of specific section of a testimonial content

const CARDS = [
  {
    id: 0,
    name: "Pasindu Athukorala",
    designation: "Lecturer in ICT",
    content: (
      <p>
        His <Highlight> eagerness </Highlight> to learn and passion for
        technology are truly inspiring. He never settles for{" "}
        <Highlight>good enough </Highlight> — always pushing himself to
        understand every detail and improve with each project.
      </p>
    ),
  },
  {
    id: 1,
    name: "Anushka Sudeera",
    designation: "ML Engineer",
    content: (
      <p>
        He has an exceptional work ethic —{" "}
        <Highlight> always dedicated, organized, and reliable. </Highlight>{" "}
        Whether it&apos;s coding late nights or exploring new technologies, he
        gives 100% every time.
      </p>
    ),
  },
  {
    id: 2,
    name: "Sanka Yashodana",
    designation: "Full Stack Developer",
    content: (
      <p>
        Working with him on group projects was an absolute pleasure. He brings
        <Highlight>
          {" "}
          positivity, great communication, and strong collaboration skills{" "}
        </Highlight>{" "}
        that make every team more productive and motivated
      </p>
    ),
  },
];
