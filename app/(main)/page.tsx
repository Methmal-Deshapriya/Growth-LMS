import ThemeToggle from "../../components/ThemeToggle";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import Advice from "../../components/Advice";
import Careers from "../../components/Careers";
import Parro from "../../components/Parro";

export default function Home() {
  return (
    <div className=" min-h-screen flex flex-col items-center bg-secbackground font-sans dark:bg-secbackground">
      <div className="bg-white dark:bg-background min-h-screen flex flex-col items-center w-full lg:w-[80vw] ">
        <ThemeToggle />
        <Navbar />
        <Hero />
        <Advice />
        <Parro />
        <Careers />
      </div>
    </div>
  );
}
