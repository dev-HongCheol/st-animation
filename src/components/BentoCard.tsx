import { useGSAP } from "@gsap/react";
import gsap, { ScrollTrigger } from "gsap/all";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  src: string;
  title: ReactNode;
  description: string;
  isComingSoon: boolean;
}

const BentoCard = ({ src, title, description }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useGSAP(() => {
    if (!videoRef.current) return;

    ScrollTrigger.create({
      trigger: videoRef.current,
      start: "top 100%",
      end: "bottom 0%",
      toggleActions: "play pause restart pause",
      onToggle: (self) => {
        if (self.isActive) {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      },
    });
  }, []);
  return (
    <div className="relative size-full">
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute left-0 top-0 size-full object-cover"
      />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h3 className="bento-title special-font">{title}</h3>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BentoCard;
