import { notFound } from "next/navigation";
import Hero from "@/features/bootcamps/components/public/detail/Hero";
import CourseDescription from "@/features/bootcamps/components/public/detail/CourseDescription";
import Curriculum from "@/features/bootcamps/components/public/detail/Curriculum";
import ForWho from "@/features/bootcamps/components/public/detail/ForWho";
import Certificate from "@/features/bootcamps/components/public/detail/Certificate";
import PriceDetails from "@/features/bootcamps/components/public/detail/PriceDetails";
import IntroVideo from "@/features/bootcamps/components/public/detail/IntroVideo";
import { courses } from "@/data/courses";

const CoursePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  const course = courses[slug as keyof typeof courses];

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