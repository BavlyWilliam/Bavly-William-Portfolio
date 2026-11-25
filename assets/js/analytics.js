/*
  Visitor analytics (Umami Cloud, free Hobby plan). Cookie-free, no personal data.

  SETUP: paste your Umami website ID below (Umami > Settings > Websites > Edit).
  While it is empty this file does nothing, so the site works the same without it.

  What gets recorded:
    - Every page view (country, device, browser, which pages, how long).
    - Tracked links: open the site with ?ref=<name>, for example
        https://bavlywilliam.github.io/Bavly-William-Portfolio/?ref=acme-dubai
      Umami then labels that visit's session "company: acme-dubai" and records an
      "application-link" event. The label follows the visitor to case-study pages.
    - Clicks: Download CV, email, WhatsApp, LinkedIn, GitHub, YouTube, Behance,
      and any other link that leaves the site (as "outbound-link").

  Your own visits: open the site once with ?notrack in each browser you use, and
  Umami ignores that browser from then on. ?notrack=off turns tracking back on.
*/
(function () {
  "use strict";

  var UMAMI_WEBSITE_ID = "d2ed0ad2-2b36-4057-b852-9285984807d5"; // Umami > Settings > Websites > Edit
  var UMAMI_SCRIPT = "https://cloud.umami.is/script.js";

  if (!UMAMI_WEBSITE_ID) return;

  var params = new URLSearchParams(window.location.search);

  // Owner opt-out. "umami.disabled" is the flag Umami's own script checks.
  try {
    if (params.has("notrack")) {
      if (params.get("notrack") === "off") localStorage.removeItem("umami.disabled");
      else localStorage.setItem("umami.disabled", "1");
    }
  } catch (e) { /* storage blocked: nothing to do */ }

  // ?ref=acme-dubai (also accepts ?utm_source=). Kept for the rest of the visit.
  function clean(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  }
  var ref = clean(params.get("ref") || params.get("utm_source"));
  var isNewRef = false;
  try {
    if (ref) {
      isNewRef = sessionStorage.getItem("bav.ref") !== ref;
      sessionStorage.setItem("bav.ref", ref);
    } else {
      ref = sessionStorage.getItem("bav.ref") || "";
    }
  } catch (e) { isNewRef = Boolean(ref); }

  function withRef(data) {
    if (ref) data.company = ref;
    return data;
  }

  function track(name, data) {
    if (window.umami && typeof window.umami.track === "function") window.umami.track(name, withRef(data || {}));
  }

  var script = document.createElement("script");
  script.defer = true;
  script.src = UMAMI_SCRIPT;
  script.setAttribute("data-website-id", UMAMI_WEBSITE_ID);
  script.onload = function () {
    if (!ref || !window.umami) return;
    if (typeof window.umami.identify === "function") window.umami.identify({ company: ref });
    if (isNewRef) track("application-link", { page: window.location.pathname });
  };
  document.head.appendChild(script);

  // One listener for the whole page, so links that render.js draws later count too.
  var NAMED = [
    [/^mailto:/i, "contact-email"],
    [/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i, "contact-whatsapp"],
    [/linkedin\.com/i, "click-linkedin"],
    [/github\.com/i, "click-github"],
    [/(youtube\.com|youtu\.be)/i, "click-youtube"],
    [/behance\.net/i, "click-behance"]
  ];

  document.addEventListener("click", function (event) {
    var link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!link) return;
    var href = link.getAttribute("href") || "";

    if (link.hasAttribute("data-bind-cv") || link.hasAttribute("download") || /\.pdf(\?|#|$)/i.test(href)) {
      track("cv-download", { from: window.location.pathname });
      return;
    }
    for (var i = 0; i < NAMED.length; i++) {
      if (NAMED[i][0].test(href)) {
        track(NAMED[i][1], { url: href.slice(0, 200), from: window.location.pathname });
        return;
      }
    }
    if (link.host && link.host !== window.location.host && /^https?:/i.test(link.protocol)) {
      track("outbound-link", { url: link.href.slice(0, 200), from: window.location.pathname });
    }
  }, true);
})();
