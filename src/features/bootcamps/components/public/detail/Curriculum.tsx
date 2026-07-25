import { cn } from "@/lib/utils";
import { Timeline } from "@/components/ui/timeline";

type theme = {
  timelineBackground: string;
};

type TimelineItem = {
  week: string;
  headline: string;
  content: string;
  theme?: theme;
};

type Props = {
  curriculum_timeline_duration: string;
  curriculum_timeline_journey: string;
  curriculum_data: TimelineItem[];
  theme?: theme;
};

const Curriculum = ({
  curriculum_timeline_duration,
  curriculum_timeline_journey,
  curriculum_data,
  theme,
}: Props) => {
  const data = curriculum_data.map((item, index) => ({
    title: item.week,
    content: (
      <div key={index}>
        <p className="mb-8 text-xl sm:text-3xl font-normal md:font-semibold  text-neutral-800  dark:text-neutral-200">
          {item.headline}
        </p>
        <p className="text-xl -mt-5 text-[12px] sm:text-sm font-poppins text-neutral-500  dark:text-neutral-200">
          {item.content}
        </p>
      </div>
    ),
  }));

  return (
    <div className="w-screen flex flex-col items-center lg:w-[80vw] xl:w-[70vw] 2xl:w-[60vw]  py-10 px-6 md:px-12 lg:px-20 ">
      <div className="max-w-7xl items-center mx-auto  px-4 md:px-8 lg:px-10 ">
        <h2 className="text-3xl sm:text-5xl font-semibold mb-20 text-center text-foreground dark:text-white max-w-4xl">
          Our{" "}
          <span className="text-primary">{curriculum_timeline_duration}</span>{" "}
          {curriculum_timeline_journey}
        </h2>
      </div>
      <div
        className={cn(
          "bg-primary/10 rounded-3xl overflow-hidden",
          theme?.timelineBackground,
        )}
      >
        <Timeline data={data} />
      </div>
    </div>
  );
};

export default Curriculum;