import { lazy, PropsWithChildren, Suspense, useEffect, useState, useMemo } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";
import { debounce } from "./utils/debounce";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const [showTechStack, setShowTechStack] = useState(false);

  const debouncedResizeHandler = useMemo(
    () =>
      debounce(() => {
        setSplitText();
        setIsDesktopView(window.innerWidth > 1024);
      }, 250),
    []
  );

  useEffect(() => {
    // Defer heavy physics and WASM loading until after initial 3D character load is complete
    const deferTimer = setTimeout(() => {
      setShowTechStack(true);
    }, 3500);

    debouncedResizeHandler();
    window.addEventListener("resize", debouncedResizeHandler);
    return () => {
      clearTimeout(deferTimer);
      window.removeEventListener("resize", debouncedResizeHandler);
    };
  }, [debouncedResizeHandler]);

  return (
    <div className="container-main">
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {isDesktopView && showTechStack && (
              <Suspense fallback={<div>Loading....</div>}>
                <TechStack />
              </Suspense>
            )}
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
