import { useState, useEffect, useRef } from "react";
import { Code, Terminal, Send } from "lucide-react";

export default function About() {
  // Mobile detection state
  const [isMobile, setIsMobile] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [typing, setTyping] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const timeoutRef = useRef(null);
  const sectionRef = useRef(null);

  const qaPairs = [
    {
      question: "What's the mission of your company?",
      answer:
        "Empower developers of all levels with intelligent tools that automate code summarization, suggest refactoring improvements, and generate technical documentation. We can reduce development time, improve code quality, and simplify programming, making it easier, more efficient, and more collaborative with AI embedding.",
    },
    {
      question: "What's your vision?",
      answer:
        "Bridging the gap between complex code and human understanding to become the leading AI-powered platform simplifying software development. We envision a future where developers can focus on creativity and problem-solving, while AI handles explanation, refactoring, and documentation with unmatched precision and speed.",
    },
  ];

  const typeText = (text, callback, speed = 50) => {
    let index = 0;
    setCurrentQuestion("");

    const typeChar = () => {
      if (index < text.length) {
        const nextChar = text.charAt(index);
        setCurrentQuestion((prev) => prev + nextChar);
        index++;
        timeoutRef.current = setTimeout(typeChar, speed);
      } else {
        if (callback) callback();
      }
    };

    timeoutRef.current = setTimeout(typeChar, 300);
  };

  useEffect(() => {
    if (!isVisible || !hasAnimated) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (animationStep === 0) {
      timeoutRef.current = setTimeout(() => {
        setConversation([
          {
            type: "ai",
            text: "Hello! I'm your AI code assistant. Would you like to know about our company?",
          },
        ]);
        setAnimationStep(1);
      }, 1000);
    } else if (animationStep === 1) {
      const currentQA = qaPairs[0];

      const question = "What's the mission of your company?";
      typeText(question, () => {
        timeoutRef.current = setTimeout(() => setAnimationStep(2), 500);
      });
    } else if (animationStep === 2) {
      setConversation([
        { type: "user", text: "What's the mission of your company?" },
      ]);
      setCurrentQuestion("");
      setTyping(true);
      timeoutRef.current = setTimeout(() => setAnimationStep(3), 1000);
    } else if (animationStep === 3) {
      const currentQA = qaPairs[0];
      setTyping(false);
      setConversation([
        { type: "user", text: "What's the mission of your company?" },
        { type: "ai", text: currentQA.answer },
      ]);
      timeoutRef.current = setTimeout(() => setAnimationStep(4), 2000);
    } else if (animationStep === 4) {
      const currentQA = qaPairs[1];

      const question = "What's your vision?";
      typeText(question, () => {
        timeoutRef.current = setTimeout(() => setAnimationStep(5), 500);
      });
    } else if (animationStep === 5) {
      setConversation([{ type: "user", text: "What's your vision?" }]);
      setCurrentQuestion("");
      setTyping(true);
      timeoutRef.current = setTimeout(() => setAnimationStep(6), 1000);
    } else if (animationStep === 6) {
      const currentQA = qaPairs[1];
      setTyping(false);
      setConversation([
        { type: "user", text: "What's your vision?" },
        { type: "ai", text: currentQA.answer },
      ]);
      timeoutRef.current = setTimeout(() => setAnimationStep(1), 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [animationStep, isVisible, hasAnimated]);

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
          }, 1200);
        } else {
          setIsVisible(false);
          setHasAnimated(false);
          setAnimationStep(0);
          setConversation([]);
          setCurrentQuestion("");
          setTyping(false);

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
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

  return (
    <section
      ref={sectionRef}
      className={`py-8 sm:py-12 md:py-16 lg:py-24 px-3 sm:px-4 md:px-6 overflow-hidden transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        padding: isMobile ? "15px 15px" : "25px 0px 25px 0px",
        margin: isMobile ? "0" : "0px 40px 0px 40px",
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transitionProperty: "opacity, transform",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
          <div
            className="space-y-4 md:space-y-6 text-center lg:text-left"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-60px)",
              transition: "opacity 1000ms ease-out, transform 1200ms ease-out",
              transitionDelay: "300ms",
            }}
          >
            <h1 className="text-3xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-[#00ADB5] to-[#EEEEEE] bg-clip-text text-transparent relative">
              About Us
            </h1>
          </div>

          <div
            className="relative mx-auto w-full max-w-sm md:max-w-none transform"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)"
                : "perspective(1000px) rotateX(10deg) rotateY(-10deg) translateZ(-50px)",
              transition:
                "opacity 1000ms ease-out, transform 1200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              transitionDelay: "600ms",
            }}
          >
            <div className="relative p-4">
              <div
                className="rounded-xl p-6 shadow-xl transform hover:scale-105"
                style={{
                  backgroundColor: "rgba(57, 62, 70, 0.05)",
                  backdropFilter: "blur(10px)",
                  transform: isVisible
                    ? "perspective(1000px) rotateX(2deg) rotateY(-2deg)"
                    : "perspective(1000px) rotateX(10deg) rotateY(-10deg)",
                  boxShadow:
                    "0 20px 30px rgba(0, 0, 0, 0.2), 0 0 40px rgba(0, 173, 181, 0.1)",
                  transition:
                    "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease",
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
                    "perspective(1000px) rotateX(2deg) rotateY(-2deg)";
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div
                    className="ml-4 flex items-center"
                    style={{ color: "#393E46" }}
                  >
                    <Terminal className="w-4 h-4 mr-2" />
                    <span className="text-sm">ai-code-assistant.js</span>
                  </div>
                </div>

                <div
                  className="font-mono text-sm rounded p-4 flex flex-col conversation-container transition-all duration-500"
                  style={{
                    backgroundColor: "rgba(34, 40, 49, 0.95)",
                    color: "#EEEEEE",
                    boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
                    transform: "translateZ(20px)",
                    height: "auto",
                    minHeight: isMobile ? "280px" : "320px",
                    maxHeight: isMobile ? "400px" : "320px",
                    overflowY: "auto",
                  }}
                >
                  <div className="flex-1 mb-4 overflow-y-auto">
                    {conversation.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-2 ${
                          message.type === "user"
                            ? "text-green-400"
                            : "text-blue-300"
                        } animate-fade-in-up`}
                        style={{
                          animation: `fadeInUp 0.5s ease-out ${
                            index * 0.2
                          }s both`,
                          opacity: 0,
                        }}
                      >
                        <span className="font-bold">
                          {message.type === "user" ? "User: " : "AI: "}
                        </span>
                        <span className="break-words">{message.text}</span>
                      </div>
                    ))}
                    {typing && (
                      <div className="text-blue-300">
                        <span className="font-bold">AI: </span>
                        <span className="typing-animation">...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex mt-auto">
                    <input
                      type="text"
                      value={currentQuestion}
                      readOnly
                      className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-l-md focus:outline-none transition-all duration-300"
                      style={{
                        backgroundColor: "rgba(57, 62, 70, 0.8)",
                        boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.3)",
                      }}
                    />
                    <button
                      className="bg-blue-500 px-3 py-2 rounded-r-md flex items-center justify-center transition-all duration-300 hover:brightness-110"
                      style={{ backgroundColor: "#00ADB5" }}
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="absolute -bottom-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: "#00ADB5",
                  boxShadow:
                    "0 10px 20px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 173, 181, 0.3)",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scale(1)" : "scale(0.5)",
                  transition:
                    "opacity 700ms ease-out, transform 700ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  transitionDelay: "900ms",
                }}
              >
                <Code
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white"
                  style={{
                    animation: isVisible ? "pulse 2s infinite" : "none",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes typing {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
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

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .typing-animation {
          animation: typing 1.5s infinite;
        }

        .conversation-container::-webkit-scrollbar {
          width: 6px;
        }

        .conversation-container::-webkit-scrollbar-track {
          background: rgba(34, 40, 49, 0.5);
          border-radius: 3px;
        }

        .conversation-container::-webkit-scrollbar-thumb {
          background: rgba(0, 173, 181, 0.5);
          border-radius: 3px;
        }

        .conversation-container::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 173, 181, 0.7);
        }
      `}</style>
    </section>
  );
}
