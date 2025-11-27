import Hero from "../../components/Hero";
import Advice from "../../components/Advice";
import Careers from "../../components/Careers";
import BootCamps from "@/components/BootCamps";
import Showcase from "@/components/Showcase";
import { StickyScrollRevealDemo } from "@/components/Experiance";
import Steps from "@/components/Steps";
import Introduction from "@/components/Introduction";
export default function Home() {
  return (
    <section>
      <div className=" dark:bg-background flex flex-col items-center w-[99vw]  ">
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
