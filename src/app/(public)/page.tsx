import Hero from "@/components/marketing/Hero";
import Advice from "@/components/marketing/Advice";
import Careers from "@/components/marketing/Careers";
import BootCamps from "@/components/marketing/BootCamps";
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
      </div>
    </section>
  );
}
