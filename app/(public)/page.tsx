import Hero from "@/components/marketing/Hero";
import Advice from "@/components/marketing/Advice";
import Careers from "@/components/marketing/Careers";
import BootCamps from "@/components/marketing/BootCamps";
import Showcase from "@/components/marketing/Showcase";
import { StickyScrollRevealDemo } from "@/components/marketing/Experiance";
import Steps from "@/components/marketing/Steps";
import Introduction from "@/components/marketing/Introduction";

export default function Home() {
  return (
    <section>
      <div className="dark:bg-background flex flex-col items-center w-[99vw]">
        <Hero />
        <Introduction />
        <Advice />
        <BootCamps />
        <Careers />
        <Showcase />
        <Steps />
        <StickyScrollRevealDemo />
      </div>
    </section>
  );
}