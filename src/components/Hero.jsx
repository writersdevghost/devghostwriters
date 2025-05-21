import React, { useState, useEffect, useRef } from "react";
import button from "../assets/button.png";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);
  const dotsArray = useRef([]);
  const animationFrameId = useRef(null);
  const buttonTextRef = useRef(null);
  const buttonRef = useRef(null);
  const headingRef = useRef(null);
  const sectionRef = useRef(null);

  const animationSequence = useRef(null);
  const contentRef = useRef(null);

  const scrollToDemo = () => {
    const demoSection = document.getElementById("demo-section");
    if (demoSection) {
      demoSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const navigateToDemo = () => {
    window.location.href = "/demo";
  };

  const generateDots = (width, height) => {
    const dotSpacing = 40;
    const dots = [];

    for (let x = 0; x < width; x += dotSpacing) {
      for (let y = 0; y < height; y += dotSpacing) {
        dots.push({
          x,
          y,
          radius: 2,
          originalX: x,
          originalY: y,
          vx: 0,
          vy: 0,
          initialScale: 0,
          scale: 0,

          connections: [],
          connectionTimer: Math.random() * 100,
        });
      }
    }

    return dots;
  };

  useEffect(() => {
    if (isMounted && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = windowSize.width;
      canvas.height = windowSize.height;

      dotsArray.current = generateDots(
        windowSize.width + 100,
        windowSize.height + 100
      );

      let mouseRadius = 0;
      let targetMouseRadius = 0;
      let startTime = performance.now();

      const animate = (timestamp) => {
        const elapsedTime = timestamp - startTime;
        const animationProgress = Math.min(elapsedTime / 2000, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        targetMouseRadius = 100;
        mouseRadius += (targetMouseRadius - mouseRadius) * 0.1;

        dotsArray.current.forEach((dot, index) => {
          dot.scale = dot.initialScale + animationProgress;
          if (dot.scale > 1) dot.scale = 1;

          dot.connectionTimer = (dot.connectionTimer + 0.5) % 200;

          dot.connections = [];

          dotsArray.current.forEach((otherDot, otherIndex) => {
            if (index !== otherIndex) {
              const dx = dot.x - otherDot.x;
              const dy = dot.y - otherDot.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const maxDistance = 70;

              if (distance < maxDistance) {
                const connectionOpacity = Math.min(dot.scale, otherDot.scale);
                dot.connections.push({
                  dot2: otherDot,
                  distance: distance,
                  maxDistance: maxDistance,

                  progress:
                    (Math.sin((dot.connectionTimer + otherIndex) * 0.05) * 0.5 +
                      0.5) *
                    connectionOpacity,
                });
              }
            }
          });
        });

        dotsArray.current.forEach((dot, index) => {
          dot.connections.forEach((conn) => {
            if (conn.progress > 0.05) {
              const opacity = conn.progress * 0.5 * animationProgress;
              const lineWidth = conn.progress * 1;

              ctx.strokeStyle = `rgba(0, 173, 181, ${opacity})`;
              ctx.lineWidth = lineWidth;

              ctx.beginPath();
              ctx.moveTo(dot.x, dot.y);
              ctx.lineTo(conn.dot2.x, conn.dot2.y);
              ctx.stroke();
            }
          });
        });

        dotsArray.current.forEach((dot) => {
          const dx = mousePosition.x - dot.x;
          const dy = mousePosition.y - dot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius) {
            const force = ((mouseRadius - distance) / mouseRadius) * 0.015;
            const directionX = dx / distance || 0;
            const directionY = dy / distance || 0;

            dot.vx -= directionX * force;
            dot.vy -= directionY * force;
          }

          dot.x += dot.vx;
          dot.y += dot.vy;

          dot.vx *= 0.85;
          dot.vy *= 0.85;

          const returnForce = 0.02;
          dot.vx += (dot.originalX - dot.x) * returnForce;
          dot.vy += (dot.originalY - dot.y) * returnForce;

          const finalRadius = dot.radius * dot.scale;
          if (finalRadius > 0) {
            ctx.fillStyle = "#393E46";
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, finalRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        if (animationProgress >= 1 && !isLoaded) {
          setIsLoaded(true);
        }

        animationFrameId.current = requestAnimationFrame(animate);
      };

      startTime = performance.now();
      animate(startTime);

      return () => {
        cancelAnimationFrame(animationFrameId.current);
      };
    }
  }, [isMounted, windowSize]);

  useEffect(() => {
    if (isMounted && buttonTextRef.current && buttonRef.current) {
      const resizeButton = () => {
        const textWidth = buttonTextRef.current.offsetWidth;
        const textHeight = buttonTextRef.current.offsetHeight;

        const horizontalPadding = 40;
        const verticalPadding = 20;

        buttonRef.current.style.width = `${textWidth + horizontalPadding}px`;
        buttonRef.current.style.height = `${textHeight + verticalPadding}px`;

        buttonRef.current.style.left = "50%";
        buttonRef.current.style.top = "50%";
        buttonRef.current.style.transform = "translate(-50%, -50%)";
      };

      resizeButton();

      const observer = new MutationObserver(resizeButton);

      observer.observe(buttonTextRef.current, {
        childList: true,
        characterData: true,
        subtree: true,
      });

      window.addEventListener("resize", resizeButton);

      return () => {
        observer.disconnect();
        window.removeEventListener("resize", resizeButton);
      };
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted && headingRef.current) {
      const updateHeading3DEffect = () => {
        if (!headingRef.current) return;

        const centerX = windowSize.width / 2;
        const centerY = windowSize.height / 2;

        const deltaX = (mousePosition.x - centerX) / centerX;
        const deltaY = (mousePosition.y - centerY) / centerY;

        const rotateX = deltaY * -5;
        const rotateY = deltaX * 5;

        headingRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      };

      updateHeading3DEffect();

      return () => {
        if (headingRef.current) {
          headingRef.current.style.transform = "none";
        }
      };
    }
  }, [isMounted, mousePosition, windowSize]);

  useEffect(() => {
    if (isMounted) {
      const throttledMouseMove = (e) => {
        window.requestAnimationFrame(() => {
          setMousePosition({
            x: e.clientX,
            y: e.clientY,
          });
        });
      };

      window.addEventListener("mousemove", throttledMouseMove);
      return () => {
        window.removeEventListener("mousemove", throttledMouseMove);
      };
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted && isLoaded && contentRef.current) {
      const timeline = (animationSequence.current = gsapFallback());

      if (timeline) {
        const children = Array.from(contentRef.current.children);

        children.forEach((child, index) => {
          timeline.add({
            targets: child,
            opacity: [0, 1],
            translateY: [30, 0],
            scale: [0.95, 1],
            easing: "easeOutExpo",
            duration: 800,
            delay: 200 + index * 150,
          });
        });
      }
    }

    return () => {
      if (animationSequence.current && animationSequence.current.pause) {
        animationSequence.current.pause();
      }
    };
  }, [isMounted, isLoaded]);

  useEffect(() => {
    setIsMounted(true);
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    if (sectionRef.current) {
      sectionRef.current.style.opacity = "0";
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.style.opacity = "1";
          sectionRef.current.style.transition = "opacity 1s ease-out";
        }
      }, 100);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const gsapFallback = () => {
    return {
      animations: [],
      add(config) {
        const { targets, opacity, translateY, scale, easing, duration, delay } =
          config;
        const el = targets;
        if (!el) return;

        el.style.opacity = "0";
        el.style.transform = `translateY(${translateY[0]}px) scale(${scale[0]})`;

        setTimeout(() => {
          el.style.transition = `opacity ${duration / 1000}s, transform ${
            duration / 1000
          }s`;
          el.style.transitionTimingFunction = "cubic-bezier(0.16, 1, 0.3, 1)";
          el.style.opacity = opacity[1];
          el.style.transform = `translateY(${translateY[1]}px) scale(${scale[1]})`;
        }, delay);

        this.animations.push(el);
      },
      pause() {
        this.animations.forEach((el) => {
          el.style.transition = "none";
        });
      },
    };
  };

  const getParallaxTransform = () => {
    if (!isMounted) return { transform: "translate(0px, 0px)" };

    const offsetX = (mousePosition.x - windowSize.width / 2) / 50;
    const offsetY = (mousePosition.y - windowSize.height / 2) / 50;

    return {
      transform: `translate(${offsetX}px, ${offsetY}px)`,
      transition: "transform 0.2s ease-out",
    };
  };

  const getGlowStyles = () => {
    if (!isMounted) return {};

    return {
      backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 173, 181, 0.4) 0%, transparent 8%)`,
      backgroundSize: "24px 24px",
      backgroundPosition: "0 0",
      animation: "pulse 4s ease-in-out infinite alternate",
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#222831]"
    >
      {isMounted && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0"
        />
      )}

      {!isMounted && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="grid-dots"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="2" fill="#393E46" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-dots)" />
          </svg>
        </div>
      )}

      <div
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-1000"
        style={{
          ...getGlowStyles(),
          opacity: isLoaded ? 1 : 0,
        }}
      ></div>

      <div
        ref={contentRef}
        className="relative z-10 text-center px-4 max-w-7xl mx-auto"
      >
        <div
          ref={headingRef}
          className="transition-transform duration-200 ease-out mb-8"
          style={{
            transformStyle: "preserve-3d",
            opacity: 0,
          }}
        >
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-[#EEEEEE] mb-6 relative"
            style={{
              textShadow: "0 0 20px rgba(0, 173, 181, 0.3)",
              transform: "translateZ(0px)",
            }}
          >
            <span
              className="absolute inset-0 text-[#00ADB5]/10"
              style={{
                transform:
                  "translateZ(-100px) translateX(-10px) translateY(-10px)",
                filter: "blur(2px)",
              }}
            >
              Accelerating Code Innovation
            </span>
            <span
              className="absolute inset-0 text-[#00ADB5]/20"
              style={{
                transform:
                  "translateZ(-75px) translateX(-8px) translateY(-8px)",
                filter: "blur(1px)",
              }}
            >
              Accelerating Code Innovation
            </span>
            <span
              className="absolute inset-0 text-[#EEEEEE]/40"
              style={{
                transform:
                  "translateZ(-50px) translateX(-5px) translateY(-5px)",
              }}
            >
              Accelerating Code Innovation
            </span>
            <span
              className="absolute inset-0 text-[#EEEEEE]/70"
              style={{
                transform:
                  "translateZ(-25px) translateX(-2px) translateY(-2px)",
              }}
            >
              Accelerating Code Innovation
            </span>

            <span style={{ position: "relative", zIndex: 5 }}>
              Accelerating Code Innovation
            </span>

            <span
              className="absolute inset-0 text-[#00ADB5]/30"
              style={{
                transform: "translateZ(10px) translateX(2px) translateY(2px)",
                filter: "blur(1px)",
              }}
            >
              Accelerating Code Innovation
            </span>
          </h1>
        </div>

        <p
          className="text-xl md:text-2xl text-[#EEEEEE]/80 max-w-2xl mx-auto mb-8"
          style={{ opacity: 0 }}
        >
          We turn your raw code into clear summaries, optimization tips, and
          documentation—so you can code more and explain less.
        </p>

        <div
          className="flex flex-wrap justify-center gap-4"
          style={{ opacity: 0 }}
        >
          <button
            onClick={scrollToDemo}
            className="relative inline-block transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
          >
            <div
              ref={buttonRef}
              className="absolute bg-no-repeat bg-center bg-contain transition-all duration-300"
              style={{
                backgroundImage: `url(${button.src})`,

                width: "auto",
                height: "auto",
              }}
            ></div>

            <span
              ref={buttonTextRef}
              className="relative z-10 inline-block px-8 py-4 text-lg font-medium text-[#EEEEEE] whitespace-nowrap"
            >
              Try Demo
            </span>
          </button>
        </div>
      </div>

      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#00ADB5]/20 blur-3xl opacity-0"
        style={{
          animation:
            "float 8s ease-in-out infinite alternate, fadeIn 1.5s 0.5s forwards",
          transformOrigin: "center center",
        }}
      ></div>
      <div
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#00ADB5]/10 blur-3xl opacity-0"
        style={{
          animation:
            "float 6s ease-in-out infinite alternate-reverse, fadeIn 1.5s 0.8s forwards",
          transformOrigin: "center center",
        }}
      ></div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse {
          0% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.7;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes drawIn {
          0% {
            stroke-dashoffset: 1000;
            opacity: 0;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }

        .animate-slideUp {
          animation: slideUp 1s ease forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 1s ease forwards;
        }

        .animate-drawIn {
          animation: drawIn 1.5s ease forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
