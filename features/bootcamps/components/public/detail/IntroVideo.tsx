const IntroVideo = ({
  introVideo_videoURL,
}: {
  introVideo_videoURL: string;
}) => {
  return (
    <section className="relative  w-screen flex flex-col justify-center items-center  py-20  px-6 md:px-12 lg:px-20 overflow-hidden ">
      <div className=" hidden xl:flex absolute z-1 rotate-30 top-30  -left-50 w-172 h-72 bg-red-300 opacity-20 rounded-full blur-3xl"></div>

      <div className=" hidden xl:flex absolute z-1 top-30 -right-40 w-152 -rotate-35 h-40 lg:h-112 bg-purple-300 opacity-20 blur-3xl rounded-full "></div>
      <div className="w-full max-w-4xl aspect-video z-10">
        <iframe
          className="w-full h-full rounded-xl "
          src={introVideo_videoURL}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </section>
  );
};

export default IntroVideo;