import ThemeToggle from "../../components/ThemeToggle";
export default function Home() {
  return (
    <div className=" min-h-screen flex flex-col items-center bg-secbackground font-sans dark:bg-secbackground">
      <div className="bg-white  dark:bg-background min-h-screen flex flex-col items-center w-[80vw] ">
        <ThemeToggle />
      </div>
    </div>
  );
}
