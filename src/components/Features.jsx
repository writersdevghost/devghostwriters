import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useInView,
  stagger,
} from "framer-motion";

import fea1 from "../assets/fea1.png";
import fea2 from "../assets/fea2.png";
import fea3 from "../assets/fea3.png";
import fea4 from "../assets/fea4.png";

const FEATURES = [
  {
    title: "Code Summary",
    description:
      "Instantly translates pasted or uploaded code into readable, plain-English descriptions.",
    icon: fea1,
    longDescription:
      "Grasping dense code should never involve hours of reading and speculation. Our AI-powered natural language code summarizer reads your code with high-level natural language processing and returns concise explanations. Browsing legacy code, coding collaboratively on a team, or simply educating - this tool gives you instant, readable feedback, saving you time and adding clarity. ",
  },
  {
    title: "Refactoring Hints",
    description:
      "Suggests optimized, cleaner code alternatives for better performance and readability.",
    icon: fea2,
    longDescription:
      "Writing code is one thing—writing great code is another. Our AI assistant reviews your existing code structure and suggests refactoring opportunities in real time. By detecting redundancies, inefficient patterns, or outdated syntax, this tool helps you implement best practices effortlessly. Improve maintainability and future-proof your projects without combing through every line manually.",
  },
  {
    title: "Code Minify",
    description:
      "Shrinks and optimizes your code to enhance performance, ensuring faster load times and improved efficiency.",
    icon: fea3,
    longDescription:
      "Clean and compact code is essential, but doing it manually takes time. Our AI Code Minify tool intelligently analyzes your code and eliminates unnecessary characters, whitespace, and redundancies. This not only reduces file size and improves performance but also ensures your code stays efficient and production-ready. Spend less time optimizing and more time deploying.",
  },
  {
    title: "Complexity Score",
    description:
      "AI-driven ratings that reveal how complex or readable your code is.",
    icon: fea4,
    longDescription:
      "Not all code is created equal—and now, you’ll know why. Our Complexity Score uses AI to analyze your code for readability, maintainability, and logic flow. The result? A visual score that helps you identify problem areas, improve quality, and prioritize where to clean things up. Think of it as your smart, always-on code reviewer.",
  },
];

const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30, delay: 0.1 },
  },
};

export default function Features() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const containerRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const x = useMotionValue(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const containerPadding = 16;
  const baseWidth = 400; // Increased from 320
  const baseHeight = 450; // Further increased height
  const itemWidth = baseWidth - containerPadding * 2;
  const itemHeight = baseHeight - containerPadding * 2;
  const trackItemOffset = itemWidth;

  const getImageSrc = (imageImport) => {
    if (typeof imageImport === "string") return imageImport;
    if (imageImport && imageImport.src) return imageImport.src;
    if (imageImport && typeof imageImport === "object")
      return imageImport.default || imageImport;

    return "/assets/placeholder.png";
  };

  const carouselItems = [...FEATURES, FEATURES[0]];

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === FEATURES.length - 1) {
            return prev + 1; // Animate to clone
          }
          if (prev === carouselItems.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isHovered, carouselItems.length]);

  useEffect(() => {
    if (containerRef.current) {
      const styleSheet = document.styleSheets[0];
      const keyframes = `
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
      `;
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }
  }, []);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const dragThreshold = 50;
    const velocityThreshold = 500;

    if (offset < -dragThreshold || velocity < -velocityThreshold) {
      if (currentIndex === FEATURES.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(Math.min(currentIndex + 1, carouselItems.length - 1));
      }
    } else if (offset > dragThreshold || velocity > velocityThreshold) {
      if (currentIndex === 0) {
        return;
      } else {
        setCurrentIndex(Math.max(currentIndex - 1, 0));
      }
    }
  };

  // Handle feature selection
  const openFeatureModal = (feature) => {
    setSelectedFeature(feature);
    setModalOpen(true);
  };

  return (
    <motion.section
      ref={sectionRef}
      className="relative overflow-hidden md:px-8"
      style={{
        borderColor: "#00ADB5/20",
        padding: "25px 0px 25px 0px",
        margin: isMobile ? "0" : "0px 40px 0px 40px",
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="absolute"></div>

      <div className="container mx-auto relative z-10 lg:hidden">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <motion.h1
            className="text-3xl md:text-4xl lg:hidden font-bold mb-12 text-center w-full bg-gradient-to-r from-[#00ADB5] to-[#EEEEEE] bg-clip-text text-transparent"
            variants={headingVariants}
          >
            Explore Our Capabilities
          </motion.h1>

          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            variants={itemVariants}
          >
            <div
              ref={containerRef}
              className="relative overflow-hidden border border-[#00ADB5]/20 bg-gradient-to-br from-[#393E46]/30 to-[#222831]/80 backdrop-blur-lg shadow-xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                width: baseWidth,
                height: baseHeight,
                borderRadius: "0rem 10rem 0rem 10rem",
                backgroundImage:
                  "linear-gradient(135deg, rgba(57,62,70,0.3) 0%, rgba(34,40,49,0.8) 100%)",
                boxShadow: "0 8px 32px 0 rgba(0, 173, 181, 0.2)",
                backdropFilter: "blur(8px)",
              }}
            >
              <motion.div
                className="flex h-full"
                style={{
                  width: itemWidth,
                  perspective: 1000,
                  perspectiveOrigin: `${
                    currentIndex * trackItemOffset + itemWidth / 2
                  }px 50%`,
                  x,
                }}
                animate={{ x: -(currentIndex * trackItemOffset) }}
                transition={effectiveTransition}
                onAnimationComplete={handleAnimationComplete}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
              >
                {carouselItems.map((feature, index) => {
                  const range = [
                    -(index + 1) * trackItemOffset,
                    -index * trackItemOffset,
                    -(index - 1) * trackItemOffset,
                  ];
                  const outputRange = [90, 0, -90];
                  const rotateY = useTransform(x, range, outputRange, {
                    clamp: false,
                  });

                  return (
                    <motion.div
                      key={index}
                      className="relative shrink-0 flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer transition-colors duration-300"
                      style={{
                        width: itemWidth,
                        height: itemHeight,
                        rotateY: rotateY,
                      }}
                      transition={effectiveTransition}
                      onClick={() => openFeatureModal(feature)}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-[#393E46]/30 to-[#222831]/20 pointer-events-none"
                        style={{
                          borderRadius: "0rem 8rem 0rem 8rem",
                          background:
                            "linear-gradient(135deg, rgba(57,62,70,0.3) 0%, rgba(34,40,49,0.2) 100%)",
                          boxShadow: "0 4px 16px 0 rgba(0, 173, 181, 0.15)",
                        }}
                      >
                        <div
                          className="absolute inset-0 opacity-50"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(238,238,238,0.2), transparent)",
                            transform: "skewX(-20deg)",
                            animation: "shine 6s infinite",
                          }}
                        />
                      </div>

                      <div className="relative z-10 flex flex-col items-center justify-center p-8">
                        <span className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#00ADB5] to-[#393E46] text-6xl mb-8 shadow-lg">
                          <img
                            src={getImageSrc(feature.icon)}
                            alt={feature.title}
                            className="w-20 h-20 object-contain"
                            onError={(e) => {
                              console.log(
                                "Image failed to load:",
                                e.target.src
                              );
                              e.target.onerror = null;
                              e.target.src = "/assets/placeholder.png";
                            }}
                          />
                        </span>

                        <h3 className="mb-4 font-bold text-2xl text-[#EEEEEE]">
                          {feature.title}
                        </h3>
                        <p className="text-lg text-[#EEEEEE]/90 px-4">
                          {feature.description}
                        </p>
                      </div>

                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-[#00ADB5]/20 to-[#393E46]/20"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
                <div className="flex justify-center gap-4">
                  {FEATURES.map((_, index) => (
                    <motion.button
                      key={index}
                      className={`h-3 w-12 rounded-full cursor-pointer transition-colors duration-150 ${
                        currentIndex % FEATURES.length === index
                          ? "bg-gradient-to-r from-[#00ADB5] to-[#393E46]"
                          : "bg-[#EEEEEE]/30"
                      }`}
                      animate={{
                        scale:
                          currentIndex % FEATURES.length === index ? 1.2 : 1,
                      }}
                      onClick={() => setCurrentIndex(index)}
                      transition={{ duration: 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto relative z-10 hidden lg:block">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            variants={itemVariants}
          >
            <div
              ref={containerRef}
              className="relative overflow-hidden border border-[#00ADB5]/20 bg-gradient-to-br from-[#393E46]/30 to-[#222831]/80 backdrop-blur-lg shadow-xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                width: baseWidth,
                height: baseHeight,
                borderRadius: "0rem 10rem 0rem 10rem",
                backgroundImage:
                  "linear-gradient(135deg, rgba(57,62,70,0.3) 0%, rgba(34,40,49,0.8) 100%)",
                boxShadow: "0 8px 32px 0 rgba(0, 173, 181, 0.2)",
                backdropFilter: "blur(8px)",
              }}
            >
              <motion.div
                className="flex h-full"
                style={{
                  width: itemWidth,
                  perspective: 1000,
                  perspectiveOrigin: `${
                    currentIndex * trackItemOffset + itemWidth / 2
                  }px 50%`,
                  x,
                }}
                animate={{ x: -(currentIndex * trackItemOffset) }}
                transition={effectiveTransition}
                onAnimationComplete={handleAnimationComplete}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
              >
                {carouselItems.map((feature, index) => {
                  const range = [
                    -(index + 1) * trackItemOffset,
                    -index * trackItemOffset,
                    -(index - 1) * trackItemOffset,
                  ];
                  const outputRange = [90, 0, -90];
                  const rotateY = useTransform(x, range, outputRange, {
                    clamp: false,
                  });

                  return (
                    <motion.div
                      key={index}
                      className="relative shrink-0 flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer transition-colors duration-300"
                      style={{
                        width: itemWidth,
                        height: itemHeight,
                        rotateY: rotateY,
                      }}
                      transition={effectiveTransition}
                      onClick={() => openFeatureModal(feature)}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-[#393E46]/30 to-[#222831]/20 pointer-events-none"
                        style={{
                          borderRadius: "0rem 8rem 0rem 8rem",
                          background:
                            "linear-gradient(135deg, rgba(57,62,70,0.3) 0%, rgba(34,40,49,0.2) 100%)",
                          boxShadow: "0 4px 16px 0 rgba(0, 173, 181, 0.15)",
                        }}
                      >
                        <div
                          className="absolute inset-0 opacity-50"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(238,238,238,0.2), transparent)",
                            transform: "skewX(-20deg)",
                            animation: "shine 6s infinite",
                          }}
                        />
                      </div>

                      <div className="relative z-10 flex flex-col items-center justify-center p-8">
                        <span className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#00ADB5] to-[#393E46] text-6xl mb-8 shadow-lg">
                          <img
                            src={getImageSrc(feature.icon)}
                            alt={feature.title}
                            className="w-16 h-16 object-contain"
                            onError={(e) => {
                              console.log(
                                "Image failed to load:",
                                e.target.src
                              );
                              e.target.onerror = null;
                              e.target.src = "/assets/placeholder.png";
                            }}
                          />
                        </span>

                        <h3 className="mb-4 font-bold text-2xl text-[#EEEEEE]">
                          {feature.title}
                        </h3>
                        <p className="text-lg text-[#EEEEEE]/90 px-4">
                          {feature.description}
                        </p>
                      </div>

                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-[#00ADB5]/20 to-[#393E46]/20"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
                <div className="flex justify-center gap-4">
                  {FEATURES.map((_, index) => (
                    <motion.button
                      key={index}
                      className={`h-3 w-12 rounded-full cursor-pointer transition-colors duration-150 ${
                        currentIndex % FEATURES.length === index
                          ? "bg-gradient-to-r from-[#00ADB5] to-[#393E46]"
                          : "bg-[#EEEEEE]/30"
                      }`}
                      animate={{
                        scale:
                          currentIndex % FEATURES.length === index ? 1.2 : 1,
                      }}
                      onClick={() => setCurrentIndex(index)}
                      transition={{ duration: 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2 text-[#EEEEEE] mt-8 lg:mt-0"
            variants={itemVariants}
          >
            <motion.h1
              className="hidden lg:block text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-[#00ADB5] to-[#EEEEEE] bg-clip-text text-transparent"
              variants={headingVariants}
            >
              Explore Our Capabilities
            </motion.h1>
          </motion.div>
        </div>
      </div>

      {/* Feature Modal */}
      {modalOpen && selectedFeature && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#222831]/80"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-4 border border-[#00ADB5]/20 bg-[#222831]/70"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#EEEEEE]/80 hover:text-[#EEEEEE] text-xl"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-6">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#00ADB5] to-[#393E46] text-3xl">
                <img
                  src={getImageSrc(selectedFeature.icon)}
                  alt={selectedFeature.title}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    console.log("Image failed to load:", e.target.src);
                    e.target.onerror = null;
                    e.target.src = "/assets/placeholder.png";
                  }}
                />
              </span>
              <h3 className="text-2xl font-bold text-[#EEEEEE]">
                {selectedFeature.title}
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-lg text-[#EEEEEE]/90 mb-4">
                {selectedFeature.description}
              </p>
              <p className="text-[#EEEEEE]/80">
                {selectedFeature.longDescription}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 bg-gradient-to-r from-[#00ADB5] to-[#393E46] rounded-lg font-medium hover:opacity-90 transition-opacity text-[#EEEEEE]"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}
