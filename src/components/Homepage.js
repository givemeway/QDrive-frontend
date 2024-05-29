import Header from "./HomePageHeader";

const HomePage = () => {
  return (
    <>
      <Header />
      <div className="w-full h-[500px]">
        <video>
          <source src="" type="video/quicktime; codecs=hvc1" />
          <source src="" type="video/webm; codecs=vp9" />
          <source
            src="https://aem.dropbox.com/cms/content/dam/dropbox/warp/en-us/dropbox/dbx1-hero-1920x1080.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </>
  );
};

export default HomePage;
