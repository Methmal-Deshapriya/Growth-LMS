import { notFound } from "next/navigation";
import Hero from "@/components/bootcamp-components/Hero";
import CourseDescription from "@/components/bootcamp-components/CourseDescription";
import Curriculum from "@/components/bootcamp-components/Curriculum";
import ForWho from "@/components/bootcamp-components/ForWho";
import Certificate from "@/components/bootcamp-components/Certificate";
import PriceDetails from "@/components/bootcamp-components/PriceDetails";
import IntroVideo from "@/components/bootcamp-components/IntroVideo";
import { courses } from "@/data/courses";
const CoursePage = async ({
  params,
}: {
  params: Promise<{ bootcamp: string }>;
}) => {
  const bootcamp = (await params).bootcamp;

  const course = courses[bootcamp as keyof typeof courses];
  if (!course) {
    notFound();
  }
  return (
    <div className="md:w-[80vw] lg:w-[70vw] flex flex-col items-center">
      <Hero {...course.hero_data} />
      <CourseDescription {...course.courseDescription_data} />
      <IntroVideo {...course.introVideo_data} />
      <Curriculum {...course.curriculum_data} />
      <ForWho {...course.forWho_data} />
      <Certificate {...course.certificate_data} />
      <PriceDetails {...course.priceDetails_data} />
    </div>
  );
};

export default CoursePage;
