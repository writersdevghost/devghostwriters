import { useState, useEffect, useRef } from "react";

import testi1 from "../assets/testi1.png";
import testi2 from "../assets/testi2.png";
import testi3 from "../assets/testi3.png";
import testi4 from "../assets/testi4.png";
import testi5 from "../assets/testi5.png";

export default function Testimonial() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const animationTriggeredRef = useRef(false);
  const autoSlideIntervalRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        setIsVisible(entry.isIntersecting);

        if (entry.isIntersecting) {
          startAutoSlide();
          animationTriggeredRef.current = true;
        } else {
          clearAutoSlide();
        }
      },
      {
        root: null,
        rootMargin: "-50px",
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      clearAutoSlide();
    };
  }, []);

  const getImageSrc = (imageImport) => {
    if (typeof imageImport === "string") return imageImport;
    if (imageImport && imageImport.src) return imageImport.src;
    if (imageImport && typeof imageImport === "object")
      return imageImport.default || imageImport;

    return "/assets/placeholder.png";
  };

  const testimonials = [
    {
      id: 1,
      quote:
        "The AI summaries help me lead my dev team better, ask smarter questions, and write more strategic code.",
      name: "Omar M.",
      title: "Product Lead",
      image: testi1,
    },
    {
      id: 2,
      quote:
        "This platform has completely transformed how I approach my daily coding and refactoring workflows.",
      name: "Joon-ho R.",
      title: "Engineering Lead",
      image: testi2,
    },
    {
      id: 3,
      quote:
        "I feel like I've learned as much from this platform as I did during my entire graduate program.",
      name: "Fernada L.",
      title: "Marketing Director",
      image: testi3,
    },
    {
      id: 4,
      quote:
        "DevGhostWriters feels like having a senior engineer available 24/7 to break down code and guide improvements.",
      name: "Shyla K.",
      title: "Design Lead",
      image: testi4,
    },
    {
      id: 5,
      quote:
        "Thanks to the AI-assisted documentation, we've been able to cut down our release cycles and reduce tech debt significantly.",
      name: "Sydney P.",
      title: "COO",
      image: testi5,
    },
  ];

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  };

  const startAutoSlide = () => {
    if (autoSlideIntervalRef.current) return;

    autoSlideIntervalRef.current = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 700);
      }
    }, 5000);
  };

  const clearAutoSlide = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isVisible) {
      startAutoSlide();
    } else {
      clearAutoSlide();
    }

    return () => clearAutoSlide();
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className={`py-12 md:py-24 px-4 md:px-6 text-white overflow-hidden transition-all duration-1000 ease-out`}
      style={{
        borderColor: "#00ADB5/20",
        padding: "25px 0px 25px 0px",
        margin: isMobile ? "0" : "0px 40px 0px 40px",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 800ms ease-out, transform 800ms ease-out",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div
            className="space-y-4 md:space-y-6 text-center lg:text-left"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-30px)",
              transition: "opacity 800ms ease-out, transform 800ms ease-out",
              transitionDelay: "300ms",
            }}
          >
            <h1 className="text-3xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-[#00ADB5] to-[#EEEEEE] bg-clip-text text-transparent">
              Testimonial
            </h1>
            <div className="flex space-x-3 mt-8 justify-center lg:justify-start">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ease-in-out transform ${
                    activeIndex === index
                      ? "bg-blue-500 scale-150"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  disabled={isTransitioning}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div
            className="relative h-80 md:h-96 perspective-1000 mx-auto w-full max-w-sm md:max-w-none"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 800ms ease-out, transform 800ms ease-out",
              transitionDelay: "600ms",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              {testimonials.map((testimonial, index) => {
                const position =
                  (index - activeIndex + testimonials.length) %
                  testimonials.length;

                let xOffset = 0;
                let yOffset = 0;
                let zOffset = 0;
                let rotateY = 0;
                let rotateX = 0;
                let rotateZ = 0;
                let opacity = 0;
                let scale = 1;
                let zIndex = 0;

                if (position === 0) {
                  xOffset = 0;
                  yOffset = 0;
                  zOffset = 0;
                  rotateY = 0;
                  rotateX = 0;
                  rotateZ = 0;
                  opacity = 1;
                  scale = 1;
                  zIndex = 30;
                } else if (position === 1) {
                  xOffset = 60;
                  yOffset = 15;
                  zOffset = -80;
                  rotateY = -8;
                  rotateX = 5;
                  rotateZ = 2;
                  opacity = 0.8;
                  scale = 0.95;
                  zIndex = 20;
                } else if (position === 2) {
                  xOffset = 120;
                  yOffset = 30;
                  zOffset = -160;
                  rotateY = -16;
                  rotateX = 10;
                  rotateZ = 4;
                  opacity = 0.6;
                  scale = 0.9;
                  zIndex = 10;
                } else {
                  xOffset = 180;
                  yOffset = 45;
                  zOffset = -240;
                  rotateY = -24;
                  rotateX = 15;
                  rotateZ = 6;
                  opacity = 0;
                  scale = 0.85;
                  zIndex = 0;
                }

                return (
                  <div
                    key={testimonial.id}
                    className="absolute transition-all duration-700 ease-out preserve-3d"
                    style={{
                      transform: `translateX(${xOffset}px) translateY(${yOffset}px) translateZ(${zOffset}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                      opacity: isVisible ? opacity : 0,
                      zIndex,
                      transformOrigin: "bottom left",
                    }}
                  >
                    <div
                      className="w-64 sm:w-72 h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl transform transition-transform duration-500 backface-hidden"
                      style={{
                        backgroundColor: "rgba(15, 23, 42, 0.65)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        boxShadow:
                          position === 0
                            ? "0 20px 50px rgba(0, 173, 181, 0.2), 0 10px 20px rgba(0, 0, 0, 0.2)"
                            : "0 10px 30px -5px rgba(0, 0, 0, 0.3)",
                      }}
                      onMouseEnter={
                        position === 0
                          ? () => {
                              const card = document.getElementById(
                                `card-${testimonial.id}`
                              );
                              if (card) {
                                card.style.transform =
                                  "rotateY(5deg) rotateX(-5deg)";
                              }
                            }
                          : undefined
                      }
                      onMouseLeave={
                        position === 0
                          ? () => {
                              const card = document.getElementById(
                                `card-${testimonial.id}`
                              );
                              if (card) {
                                card.style.transform =
                                  "rotateY(0deg) rotateX(0deg)";
                              }
                            }
                          : undefined
                      }
                      id={`card-${testimonial.id}`}
                    >
                      <div className="p-6 flex flex-col h-full justify-between relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 opacity-50 pointer-events-none"></div>
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none"></div>

                        {position === 0 && (
                          <div className="flex justify-center mb-4 relative z-10">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-blue-400 shadow-lg transform transition-transform duration-500 hover:scale-105">
                              <img
                                src={getImageSrc(testimonial.image)}
                                alt={`${testimonial.name}'s profile`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.log(
                                    "Image failed to load:",
                                    e.target.src
                                  );
                                  e.target.onerror = null;
                                  e.target.src = "/assets/placeholder.png";
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex-grow flex items-center justify-center relative z-10">
                          <p className="text-lg text-center text-gray-300 font-medium">
                            "{testimonial.quote}"
                          </p>
                        </div>

                        <div className="text-center text-blue-400 mt-4 relative z-10">
                          <p>
                            {testimonial.name} - {testimonial.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .preserve-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
}
