import { type MouseEvent } from "react";
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

const Story = () => {
  const onMouseEnter = (event: MouseEvent) => {
    event.currentTarget.classList.add("scale-125");
  };

  const handleMouseLeave = (event: MouseEvent) => {
    event.currentTarget.classList.remove("scale-125");
  };

  return (
    <div className="min-h-dvh w-full bg-black text-blue-50" id="story">
      <div className="flex size-full flex-col items-center py-10 pb-24">
        <p className="font-general text-sm uppercase md:text-[10px]">
          the multiversal ip world
        </p>

        <div className="relative size-full">
          <AnimatedTitle
            title="The story of<br />a hidden realm"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10"
          />

          <div className="story-img-container">
            <div className="story-img-mask">
              <div className="story-img-content">
                <img
                  onMouseLeave={onMouseEnter}
                  onMouseEnter={handleMouseLeave}
                  src={"img/entrance.webp"}
                  alt="entrance"
                  className="object-contain transition duration-800 ease-in-out"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="-mt-80 flex w-full justify-center md:-mt-64 md:me-44 md:justify-end">
          <div className="flex h-full w-fit flex-col items-center md:items-start">
            <p className="mt-3 max-w-sm text-center font-circular-web text-violet-50 md:text-start">
              Where realms converge, lies Zentry and the boundless pillar.
              Discover its secrets and shape your fate amidst infinite
              opportunities.
            </p>

            <Button
              id="realm-btn"
              title="discover prologue"
              containerClass="mt-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
