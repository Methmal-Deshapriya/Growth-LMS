import ThemeToggle from "../../components/ThemeToggle";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import Advice from "../../components/Advice";
import Careers from "../../components/Careers";
import Parro from "../../components/Parro";
import BootCamps from "@/components/BootCamps";
import Instructors from "@/components/Instructors";
import Showcase from "@/components/Showcase";
import { StickyScrollRevealDemo } from "@/components/Experiance";
import Steps from "@/components/Steps";
import Image from "next/image";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-secbackground font-sans dark:bg-secbackground">
      <div className="relative bg-white dark:bg-background min-h-screen flex flex-col items-center w-full lg:w-[80vw] ">
        <div
          className="absolute top-0 left-0 w-screen h-[40vh] sm:h-[60vh] md:w-[80vw] md:h-[70vh] lg:w-[60vw] xl:w-[50vw] xl:h-[80vh]
    [clip-path:polygon(0_0,100%_0,0_100%)]
    overflow-hidden
    
  "
        >
          <div className="absolute inset-0 bg-[#F9C784] [clip-path:polygon(0_0,70%_0,0_100%)]"></div>
          <div className="absolute inset-0 bg-[#E57373] opacity-80 [clip-path:polygon(0_20%,80%_0,20%_100%)]"></div>
          <div className="absolute inset-0 bg-[#F06292] opacity-70 [clip-path:polygon(30%_0,100%_0,40%_100%)]"></div>
          <div className="absolute inset-0 bg-[#4DD0E1] opacity-80 [clip-path:polygon(50%_0,100%_0,100%_40%)]"></div>
          <div className="absolute inset-0 bg-[#81C784] opacity-80 [clip-path:polygon(0_40%,60%_100%,0_100%)]"></div>

          <div className="absolute inset-0 bg-[#FFD54F] opacity-70 [clip-path:polygon(10%_0,40%_0,15%_40%)]"></div>
          <div className="absolute inset-0 bg-[#FF8A65] opacity-70 [clip-path:polygon(0_10%,30%_30%,0_40%)]"></div>
          <div className="absolute inset-0 bg-[#BA68C8] opacity-60 [clip-path:polygon(60%_0,100%_10%,70%_50%)]"></div>
          <div className="absolute inset-0 bg-[#4FC3F7] opacity-60 [clip-path:polygon(70%_20%,100%_0,100%_35%)]"></div>
          <div className="absolute inset-0 bg-[#AED581] opacity-60 [clip-path:polygon(0%_60%,40%_100%,10%_100%)]"></div>
          <div className="absolute inset-0 bg-[#FFB74D] opacity-60 [clip-path:polygon(20%_70%,70%_100%,40%_100%)]"></div>
          <div className="absolute inset-0 bg-[#9575CD] opacity-55 [clip-path:polygon(45%_20%,80%_60%,60%_80%)]"></div>
          <div className="absolute inset-0 bg-[#4DB6AC] opacity-55 [clip-path:polygon(0%_25%,20%_45%,5%_70%)]"></div>
          <div className="absolute inset-0 bg-[#FFF176] opacity-60 [clip-path:polygon(35%_0,60%_20%,50%_40%)]"></div>
        </div>
        <ThemeToggle />
        <Navbar />
        <Hero />
        <Advice />
        <Parro />
        <BootCamps />
        <Instructors />
        <Careers />
        <Showcase />
        <Steps />
        <StickyScrollRevealDemo />
      </div>
    </div>
  );
}
