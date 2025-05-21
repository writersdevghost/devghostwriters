import React, { useState, useEffect } from "react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always enabled
    analytics: true,
    marketing: false,
    preferences: true,
  });

  useEffect(() => {
    const consentGiven = localStorage.getItem("cookieConsentGiven");

    if (!consentGiven) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });

    saveCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });

    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    saveCookiePreferences(cookiePreferences);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    setCookiePreferences(newPreferences);
    saveCookiePreferences(newPreferences);
    setIsVisible(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePreferenceChange = (key, value) => {
    setCookiePreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveCookiePreferences = (preferences) => {
    localStorage.setItem("cookieConsentGiven", "true");
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));

    if (preferences.analytics) {
      console.log("Setting analytics cookies");
    }

    if (preferences.marketing) {
      console.log("Setting marketing cookies");
    }

    if (preferences.preferences) {
      console.log("Setting preferences cookies");
    }
  };

  const handleOpenSettings = () => {
    setIsVisible(true);
  };

  if (!isVisible) {
    return (
      <button
        onClick={handleOpenSettings}
        className="fixed bottom-4 left-4 bg-[#00ADB5] text-[#EEEEEE] rounded-full p-2 z-50 shadow-lg hover:bg-[#017177] transition-all duration-300"
        aria-label="Cookie settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#EEEEEE] rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#222831] text-[#EEEEEE] p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Cookie Preferences</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-[#EEEEEE] hover:text-[#00ADB5] transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#393E46]">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "all"
                ? "bg-[#00ADB5] text-[#EEEEEE]"
                : "bg-[#EEEEEE] text-[#222831] hover:bg-[#E0E0E0]"
            }`}
            onClick={() => handleTabChange("all")}
          >
            All Cookies
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "details"
                ? "bg-[#00ADB5] text-[#EEEEEE]"
                : "bg-[#EEEEEE] text-[#222831] hover:bg-[#E0E0E0]"
            }`}
            onClick={() => handleTabChange("details")}
          >
            Detailed Preferences
          </button>
        </div>

        <div className="overflow-y-auto flex-grow p-4">
          {activeTab === "all" && (
            <div>
              <p className="mb-4">
                We use cookies to enhance your browsing experience, serve
                personalized ads or content, and analyze our traffic. By
                clicking "Accept All", you consent to our use of cookies.
              </p>

              <div className="bg-[#F5F5F5] p-4 rounded-lg mb-4 border-l-4 border-[#00ADB5]">
                <p className="text-[#222831]">
                  This website uses cookies to ensure you get the best
                  experience on our website. Learn more about our .
                </p>
              </div>

              <div className="flex items-center mb-2">
                <svg
                  className="h-8 w-8 text-[#00ADB5] mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"></path>
                  <path d="M10 4a1 1 0 00-1 1v4a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414L10.5 8.5V5a1 1 0 00-1-1z"></path>
                </svg>
                <span className="font-medium">
                  Your choices will be saved for 1 year
                </span>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="necessary"
                      checked={cookiePreferences.necessary}
                      disabled
                      className="rounded border-[#393E46] text-[#00ADB5] focus:ring-[#00ADB5]"
                    />
                    <label
                      htmlFor="necessary"
                      className="ml-2 font-medium text-[#222831]"
                    >
                      Necessary Cookies
                    </label>
                  </div>
                  <span className="bg-[#222831] text-[#EEEEEE] px-2 py-1 text-xs rounded">
                    Always Active
                  </span>
                </div>
                <p className="text-sm text-[#393E46]">
                  These cookies are essential for the website to function
                  properly and cannot be disabled.
                </p>
              </div>

              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="analytics"
                      checked={cookiePreferences.analytics}
                      onChange={(e) =>
                        handlePreferenceChange("analytics", e.target.checked)
                      }
                      className="rounded border-[#393E46] text-[#00ADB5] focus:ring-[#00ADB5]"
                    />
                    <label
                      htmlFor="analytics"
                      className="ml-2 font-medium text-[#222831]"
                    >
                      Analytics Cookies
                    </label>
                  </div>
                </div>
                <p className="text-sm text-[#393E46]">
                  These cookies allow us to count visits and traffic sources so
                  we can measure and improve the performance of our site.
                </p>
              </div>

              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="marketing"
                      checked={cookiePreferences.marketing}
                      onChange={(e) =>
                        handlePreferenceChange("marketing", e.target.checked)
                      }
                      className="rounded border-[#393E46] text-[#00ADB5] focus:ring-[#00ADB5]"
                    />
                    <label
                      htmlFor="marketing"
                      className="ml-2 font-medium text-[#222831]"
                    >
                      Marketing Cookies
                    </label>
                  </div>
                </div>
                <p className="text-sm text-[#393E46]">
                  These cookies are used to track visitors across websites. The
                  intention is to display ads that are relevant and engaging.
                </p>
              </div>

              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="preferences"
                      checked={cookiePreferences.preferences}
                      onChange={(e) =>
                        handlePreferenceChange("preferences", e.target.checked)
                      }
                      className="rounded border-[#393E46] text-[#00ADB5] focus:ring-[#00ADB5]"
                    />
                    <label
                      htmlFor="preferences"
                      className="ml-2 font-medium text-[#222831]"
                    >
                      Preferences Cookies
                    </label>
                  </div>
                </div>
                <p className="text-sm text-[#393E46]">
                  These cookies enable the website to remember choices you make
                  and provide enhanced, personalized features.
                </p>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#222831]">
                Cookie Policy
              </h3>
              <p>
                This Cookie Policy explains how we use cookies and similar
                technologies to recognize you when you visit our website. It
                explains what these technologies are and why we use them, as
                well as your rights to control our use of them.
              </p>

              <h4 className="font-medium text-[#222831]">What are cookies?</h4>
              <p>
                Cookies are small data files that are placed on your computer or
                mobile device when you visit a website. Cookies are widely used
                by website owners in order to make their websites work, or to
                work more efficiently, as well as to provide reporting
                information.
              </p>

              <h4 className="font-medium text-[#222831]">
                Why do we use cookies?
              </h4>
              <p>
                We use first-party and third-party cookies for several reasons.
                Some cookies are required for technical reasons in order for our
                Website to operate, and we refer to these as "essential" or
                "strictly necessary" cookies. Other cookies also enable us to
                track and target the interests of our users to enhance the
                experience on our Website. Third parties serve cookies through
                our Website for advertising, analytics and other purposes.
              </p>

              <h4 className="font-medium text-[#222831]">
                How can you control cookies?
              </h4>
              <p>
                You have the right to decide whether to accept or reject
                cookies. You can exercise your cookie rights by setting your
                preferences in the Cookie Consent Manager. The Cookie Consent
                Manager allows you to select which categories of cookies you
                accept or reject. Essential cookies cannot be rejected as they
                are strictly necessary to provide you with services.
              </p>
            </div>
          )}
        </div>

        <div className="bg-[#EEEEEE] p-4 border-t border-[#393E46] flex flex-wrap gap-2">
          <button
            onClick={handleAcceptAll}
            className="bg-[#00ADB5] text-[#EEEEEE] px-4 py-2 rounded font-medium hover:bg-[#017177] transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={handleAcceptSelected}
            className="bg-[#393E46] text-[#EEEEEE] px-4 py-2 rounded font-medium hover:bg-[#2D323A] transition-colors"
          >
            Accept Selected
          </button>
          <button
            onClick={handleRejectAll}
            className="bg-[#222831] text-[#EEEEEE] px-4 py-2 rounded font-medium hover:bg-[#1A1E24] transition-colors"
          >
            Reject All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
