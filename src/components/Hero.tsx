import { useEffect, useMemo, useRef, useState } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll(true);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // FIXME: 사용도를 모르겠음. 불필요 로직
  const [loadedVideos, setLoadedVideos] = useState(0);

  const totalVideos = 3;
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  const handleVideoLoad = () => {
    console.log(loadedVideos);
    setLoadedVideos((pre) => pre + 1);
  };

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => {
            nextVideoRef.current?.play();
          },
        });
        gsap.from("#next-video", {
          onComplete: () => {
            backgroundVideoRef.current?.pause();
          },
        });
      }
    },
    { dependencies: [currentIndex], revertOnUpdate: true }
  );

  useGSAP(() => {
    gsap.fromTo(
      "#video-frame",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        borderRadius: "0",
      },
      {
        clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
        borderRadius: "0 0 40% 10%",
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#video-frame",
          start: "center center",
          end: "bottom center",
          scrub: true,
        },
      }
    );
  });

  const upcomingVideoIndex = useMemo(
    () => (currentIndex % totalVideos) + 1,
    [currentIndex]
  );

  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setLoadedVideos((pre) => pre + 1);
    }
  }, [loadedVideos]);

  // 모바일환경 백그라운드 자동재생
  useEffect(() => {
    const playBackgroundVideo = () => {
      if (backgroundVideoRef.current) {
        backgroundVideoRef.current.play().catch(console.error);
      }
    };

    playBackgroundVideo();
    document.addEventListener("touchstart", playBackgroundVideo, {
      once: true,
    });

    return () => {
      document.removeEventListener("touchstart", playBackgroundVideo);
    };
  }, []);

  const handleMiniVideoClick = () => {
    setHasClicked(true);
    setCurrentIndex(upcomingVideoIndex);
  };
  const getVideoSrc = (index: number) => `videos/hero-${index}.mp4`;

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="flex-center absolute z-[100] h-full w-full bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-full rounded-lg bg-blue-75"
        onClick={handleMiniVideoClick}
      >
        <div>
          {/* video 2 */}
          <video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            playsInline
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />

          {/* video 3 */}
          <video
            ref={backgroundVideoRef}
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            loop
            muted
            playsInline
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            {/* FIXME: h1 이 이렇게 두개 있어도 돼? */}
            <h1 className="special-font hero-heading text-blue-100">
              redefi<b>n</b>
            </h1>

            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the MetaGame Layer
              <br />
              Unleash the Play Economy
            </p>
            <Button
              id="watch-trailer"
              title="Watch Trailer"
              leftIcon={<TiLocationArrow />}
              containerClass={"bg-yellow-300 flex-center gap-1"}
            />
          </div>
          <p className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
            G<b>a</b>ming
          </p>
        </div>
      </div>
      <p className="special-font hero-heading absolute bottom-5 right-5 text-blue-black">
        G<b>a</b>ming
      </p>
    </div>
  );
};

export default Hero;
