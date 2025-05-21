import { useState, useEffect, useRef } from "react";
import { Code } from "lucide-react";
import par1 from "../assets/par1.png";
import par2 from "../assets/par2.png";
import par3 from "../assets/par3.png";
import par4 from "../assets/par4.png";
import par5 from "../assets/par5.png";

export default function Partners() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [codeEffect, setCodeEffect] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const autoplayTimerRef = useRef(null);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const typewriterTimeoutRef = useRef(null);

  const partners = [
    {
      name: "Groq AI",
      logo: par1.src,
      link: "https://groq.com/",
    },
    {
      name: "Terser",
      logo: par2.src,
      link: "https://terser.org/",
    },
    {
      name: "huggingface",
      logo: par3.src,
      link: "https://huggingface.co/",
    },
    {
      name: "Codesquire AI",
      logo: par4.src,
      link: "https://codesquire.ai/",
    },
    {
      name: "Sonarcloud",
      logo: par5.src,
      link: "https://www.sonarsource.com/products/sonarcloud/",
    },
  ];

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
        if (entry.isIntersecting) {
          setIsVisible(true);

          setTimeout(() => {
            setHasAnimated(true);
          }, 300);
        } else {
          setIsVisible(false);
          setHasAnimated(false);
          setCodeEffect("");

          if (typewriterTimeoutRef.current) {
            clearTimeout(typewriterTimeoutRef.current);
            typewriterTimeoutRef.current = null;
          }

          if (autoplayTimerRef.current) {
            clearInterval(autoplayTimerRef.current);
            autoplayTimerRef.current = null;
          }
        }
      },
      {
        root: null,
        rootMargin: "-100px",
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
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const styleSheet = document.styleSheets[0];
      const keyframes = `
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
      `;
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
      } catch (e) {
        console.log("Animation rule may already exist");
      }
    }
  }, []);

  useEffect(() => {
    if (isVisible && hasAnimated && !isHovering) {
      autoplayTimerRef.current = setInterval(() => {
        nextSlide();
      }, 3000);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isHovering, currentIndex, isVisible, hasAnimated]);

  useEffect(() => {
    if (!isVisible || !hasAnimated) return;

    const codeLines = [
      "import ai from 'partner-ai';",
      "const solution = DevGhostWriters.ai.generateCode();",
      "export function optimize(code) {",
      "  return ai.enhance(code);",
      "}",
    ];

    let currentLine = 0;
    let currentChar = 0;
    let text = "";
    let isDeleting = false;

    const typeWriter = () => {
      const line = codeLines[currentLine];

      if (!isDeleting) {
        text = line.substring(0, currentChar + 1);
        currentChar++;

        if (currentChar === line.length) {
          isDeleting = true;
          typewriterTimeoutRef.current = setTimeout(typeWriter, 1500);
          return;
        }
      } else {
        text = line.substring(0, currentChar - 1);
        currentChar--;

        if (currentChar === 0) {
          isDeleting = false;
          currentLine = (currentLine + 1) % codeLines.length;
        }
      }

      setCodeEffect(text);
      typewriterTimeoutRef.current = setTimeout(
        typeWriter,
        isDeleting ? 50 : 100
      );
    };

    typeWriter();

    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, [isVisible, hasAnimated]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === partners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? partners.length - 1 : prevIndex - 1
    );
  };

  const PartnerCard = () => (
    <div
      className="flex flex-col"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "perspective(1000px) translateY(0)"
          : "perspective(1000px) translateY(40px)",
        transition:
          "opacity 1000ms ease-out, transform 1200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <div
        ref={containerRef}
        className="p-4 sm:p-6 rounded-lg transition-all mb-4 sm:mb-6 transform perspective-1000 hover:rotate-y-5 relative overflow-hidden border border-[#00ADB5]/20 bg-gradient-to-br from-[#393E46]/30 to-[#222831]/80 backdrop-blur-lg shadow-xl"
        style={{
          backgroundColor: "rgba(57, 62, 70, 0.1)",
          transformStyle: "preserve-3d",
          transition: "transform 0.5s ease, box-shadow 0.5s ease",
          borderRadius: isMobile ? "1.5rem" : "2rem",
          boxShadow: isVisible
            ? "0 8px 32px 0 rgba(0, 173, 181, 0.2)"
            : "0 0 0 0 rgba(0, 173, 181, 0)",
          backdropFilter: "blur(8px)",
        }}
        onMouseMove={(e) => {
          if (isMobile) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / 30;
          const rotateY = (centerX - x) / 30;

          e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }}
        onMouseLeave={(e) => {
          if (isMobile) return;
          e.currentTarget.style.transform =
            "perspective(1000px) rotateX(0) rotateY(0)";
        }}
      >
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(238,238,238,0.2), transparent)",
            transform: "skewX(-20deg)",
            animation: isVisible ? "shine 6s infinite" : "none",
            animationDelay: "0.5s",
          }}
        />

        <a
          href={partners[currentIndex].link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div
            className="p-4 rounded-md mb-4 flex items-center justify-center w-full h-24 sm:h-32 relative overflow-hidden"
            style={{
              backgroundColor: "#222831",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              transform: "translateZ(20px)",
              borderRadius: isMobile
                ? "0rem 2rem 0rem 2rem"
                : "0rem 3rem 0rem 3rem",
              transition: "transform 0.5s ease",
            }}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center transition-opacity duration-300"
              style={{
                transform: "translateZ(10px)",
                opacity: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0";
              }}
            >
              <span className="text-sm font-mono" style={{ color: "#00ADB5" }}>
                Visit Partner
              </span>
            </div>

            <img
              src={partners[currentIndex].logo}
              alt={`${partners[currentIndex].name} logo`}
              className="object-contain max-w-full max-h-full"
              style={{
                transform: "translateZ(30px)",
                maxHeight: isMobile ? "90px" : "126px",
                transition: "transform 0.3s ease, opacity 0.3s ease",
                opacity: isVisible ? 1 : 0,
              }}
            />
          </div>
        </a>

        <h3
          className="text-lg sm:text-xl font-medium text-center"
          style={{
            color: "#EEEEEE",
            transform: "translateZ(15px)",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.5s ease 0.3s",
          }}
        >
          {partners[currentIndex].name}
        </h3>

        <div
          className="flex items-center mt-3 sm:mt-4 space-x-2 sm:space-x-4"
          style={{
            transform: "translateZ(10px)",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.5s ease 0.5s",
          }}
        >
          <div className="flex-1 flex items-center justify-center">
            {partners.map((_, idx) => (
              <span
                key={idx}
                className={`block w-2 h-2 sm:w-3 sm:h-3 rounded-full mx-1 cursor-pointer transform hover:scale-125 transition-transform ${
                  idx === currentIndex ? "opacity-100" : "opacity-30"
                }`}
                style={{
                  backgroundColor: idx === currentIndex ? "#00ADB5" : "#EEEEEE",
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
                onClick={() => setCurrentIndex(idx)}
              ></span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="p-3 sm:p-4 rounded-lg font-mono text-xs sm:text-sm relative transform overflow-hidden border border-[#00ADB5]/20 w-full mx-auto"
        style={{
          backgroundColor: "rgba(57, 62, 70, 0.8)",
          color: "#EEEEEE",
          transition:
            "transform 0.5s ease, box-shadow 0.5s ease, opacity 0.8s ease",
          boxShadow: isVisible
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            : "0 0 0 0 rgba(0, 0, 0, 0)",
          borderRadius: "1rem",
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "translateY(0) translateZ(0)"
            : "translateY(20px) translateZ(0)",
          transitionDelay: "0.2s",
        }}
      >
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(238,238,238,0.2), transparent)",
            transform: "skewX(-20deg)",
            animation: isVisible ? "shine 8s infinite" : "none",
            animationDelay: "1s",
          }}
        />

        <div
          className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2"
          style={{
            transform: "translateZ(10px)",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.5s ease",
            transitionDelay: "0.6s",
          }}
        >
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
          <span className="text-xs ml-1 sm:ml-2 opacity-50">
            partner_integration.js
          </span>
        </div>
        <div
          className="h-12 sm:h-16 overflow-hidden"
          style={{
            transform: "translateZ(15px)",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.5s ease",
            transitionDelay: "0.8s",
          }}
        >
          <pre>
            <code style={{ color: "#00ADB5" }}>
              {codeEffect}
              <span className="animate-pulse">|</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-16 px-4 relative overflow-hidden md:px-8"
      style={{
        borderColor: "#00ADB5/20",
        margin: isMobile ? "0" : "0px 40px 0px 40px",
      }}
    >
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 lg:mb-0 text-center lg:text-left w-full lg:w-1/2 lg:order-2 bg-gradient-to-r from-[#00ADB5] to-[#EEEEEE] bg-clip-text text-transparent transform perspective-1000 relative"
            style={{
              textAlign: "center",
              textShadow: "0 20px 25px rgba(0, 0, 0, 0.1)",
              transform: isVisible
                ? "translateZ(5px) rotateX(5deg) translateX(0)"
                : "translateZ(5px) rotateX(5deg) translateX(50px)",
              opacity: isVisible ? 1 : 0,
              transition:
                "opacity 1000ms ease-out, transform 1200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              transitionDelay: "300ms",
            }}
          >
            Collaboration Crew
          </h1>

          <div
            className="w-full lg:w-1/2 lg:order-1"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <PartnerCard />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulse {
          animation: pulse 1s infinite;
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
      `}</style>
    </section>
  );
}
