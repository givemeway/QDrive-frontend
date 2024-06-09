import Header from "./HomePageHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSignupEmail } from "../features/signup/signupSlice.js";
import { useEffect } from "react";

const Features = () => {
  return (
    <>
      <div className="w-full h-[100px] flex justify-center items-center mt-5">
        <h2 className="w-full text-2xl font-sans text-center tracking-wider text-[#F7F5F2] font-semibold">
          What can you do with QDrive?
        </h2>
      </div>
      <div className="w-full gap-2 grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 mt-5">
        <div className="flex flex-col justify-start items-center min-w-[150px] min-h-[250px] gap-2">
          <div className="flex w-full justify-start items-center">
            <img
              src={
                "https://fjord.dropboxstatic.com/warp/conversion/dropbox/warp/icons/ProtectFilesDark.svg?id=522e2ebf-a0ca-4b4b-9c0b-e399442719de"
              }
            />
          </div>
          <div className="flex justify-start items-center w-full ">
            <h3 className="w-full h-full text-xl text-left tracking-wider text-[#F7F5F2] font-medium">
              Store and protect your files
            </h3>
          </div>
          <div className="flex justify-start items-center w-full grow">
            <p className="w-full text-md text-left text-[#F7F5F2] font-thin">
              Get the storage you and your teams need with security features
              like file recovery, password protection, watermarking, and viewer
              history.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-start items-center min-w-[150px] min-h-[250px] gap-2">
          <div className="flex w-full justify-start items-center">
            <img
              src={
                "https://fjord.dropboxstatic.com/warp/conversion/dropbox/warp/icons/SharedContentDark.svg?id=f718921a-2979-4312-b5ad-e40509c5efc2"
              }
            />
          </div>
          <div className="flex justify-start items-center w-full ">
            <h3 className="w-full h-full text-xl text-left tracking-wider text-[#F7F5F2] font-medium">
              Stay in control of shared content
            </h3>
          </div>
          <div className="flex justify-start items-center w-full grow">
            <p className="w-full text-md text-left text-[#F7F5F2] font-thin">
              Trackable links show when someone has opened a shared file and how
              long they’ve engaged with it. Plus, you can turn off access for
              any individual at any time without affecting others’ permissions.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-start items-center min-w-[150px] min-h-[250px] gap-2">
          <div className="flex w-full justify-start items-center">
            <img
              src={
                "https://fjord.dropboxstatic.com/warp/conversion/dropbox/warp/icons/CollaborateDark.svg?id=d6f1841b-b694-417d-9d20-877aad41b4d9"
              }
            />
          </div>
          <div className="flex justify-start items-center w-full ">
            <h3 className="w-full h-full text-xl text-left tracking-wider text-[#F7F5F2] font-medium">
              Collaborate on your work
            </h3>
          </div>
          <div className="flex justify-start items-center w-full grow">
            <p className="w-full text-md text-left text-[#F7F5F2] font-thin">
              Directly edit PDFs and use video tools to streamline feedback and
              approval processes.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-start items-center min-w-[150px] min-h-[250px] gap-2">
          <div className="flex w-full justify-start items-center">
            <img
              src={
                "https://fjord.dropboxstatic.com/warp/conversion/dropbox/warp/icons/ManageBusinessDark.svg?id=2008b1f6-a8b4-4303-aeb9-4c2c4bf78484"
              }
            />
          </div>
          <div className="flex justify-start items-center w-full ">
            <h3 className="w-full h-full text-xl text-left tracking-wider text-[#F7F5F2] font-medium">
              Manage your business
            </h3>
          </div>
          <div className="flex justify-start items-center w-full grow">
            <p className="w-full text-md text-left text-[#F7F5F2] font-thin">
              Automate manual processes with tools like eSignature templates,
              which let you reuse documents in seconds.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const SignupBody = () => {
  const [email, setEmail] = useState(undefined);
  const [invalid, setIsInvalid] = useState(false);
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignup, setIsSignup] = useState(false);
  const { signupEmail } = useSelector((state) => state.signup);

  const handleSignup = (e) => {
    e.stopPropagation();
    if (emailRegex.test(email)) {
      setIsSignup(true);
      setIsInvalid(false);
      dispatch(setSignupEmail(email));
    } else {
      setIsInvalid(true);
    }
  };
  const handleInput = (e) => {
    setIsInvalid(false);
    setEmail(e.target.value);
  };

  useEffect(() => {
    if (signupEmail && isSignup) {
      navigate("/signup");
    }
  }, [signupEmail, isSignup]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full justify-center items-center">
      <div
        className={`w-full md:w-[200px] h-[40px] ${
          invalid ? "h-[70px]" : "h-[40px]"
        } flex flex-col justify-start items-start`}
      >
        <input
          placeholder="Enter your email address"
          className="w-full h-[40px] border outline-none bg-black outline-offset-0 text-white
                    focus:outline-2 focus:outline-[#428BFF] focus:border-white pl-2 duration-100"
          onChange={handleInput}
          value={email}
        />
        {invalid && (
          <div className="w-full flex justify-start items-center h-[30px]">
            <span className="w-full text-xs text-[#EC3C1A] text-left">
              An email address must contain a single @
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-start items-start w-full md:w-[200px] h-full">
        <button
          className="text-[white] border-2 rounded-md w-full md:w-[200px] h-[40px] hover:bg-[#423E3E] duration-100"
          onClick={handleSignup}
        >
          Signup for free
        </button>
      </div>
    </div>
  );
};

const MainBody = () => {
  return (
    <div className="flex flex-col justify-center items-center  pt-10 gap-4">
      <h3 className="text-3xl text-[#F7F5F2] font-bold font-sans text-center tracking-wider">
        Join over 700 million registered users who trust QDrive
      </h3>
      <p className="text-l text-[#F7F5F2] text-center font-sans tracking-wide">
        Ease to use, reliable, private and secure. It's no wonder QDrive is the
        choice for storing and sharing your most important files.
      </p>
      <SignupBody />
    </div>
  );
};

const VideoBody = () => {
  return (
    <div className="w-full mt-5">
      <video
        aria-hidden="false"
        aria-label=""
        autoplay=""
        playsinline=""
        loop=""
        muted=""
      >
        <source src="" type="video/quicktime; codecs=hvc1" />
        <source src="" type="video/webm; codecs=vp9" />
        <source
          src="https://aem.dropbox.com/cms/content/dam/dropbox/warp/en-us/dropbox/dbx1-hero-1920x1080.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
};

const HomePage = () => {
  return (
    <>
      <div className="w-screen h-screen flex flex-col justify-start items-center">
        <Header />
        <div className="flex flex-col justify-start items-center bg-black w-full h-full pl-4 pr-4 overflow-auto">
          <MainBody />
          <VideoBody />
          <Features />
        </div>
      </div>
    </>
  );
};

export default HomePage;
