/*
  Draws both pages from window.PORTFOLIO (assets/js/data.js):
    index.html  the portfolio
    case.html   one case study, chosen by ?p=<project id>
  You should not need to edit this file to add projects, case studies,
  videos or creative work. Every piece of text is inserted with
  textContent, never innerHTML, so nothing in data.js can inject markup.
*/
(function () {
  "use strict";

  var data = window.PORTFOLIO;
  if (!data) return;

  var STATUS = { live: "Live", working: "Working build", prototype: "Prototype", progress: "In progress" };

  /* ---------- helpers ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === "class") node.className = value;
        else if (key === "text") node.textContent = value;
        else node.setAttribute(key, value);
      });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined || child === false) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }
  function $(selector) { return document.querySelector(selector); }
  function list(name) { return $('[data-list="' + name + '"]'); }
  function isExternal(url) { return /^https?:\/\//.test(url); }
  function link(href, text, cls) {
    return el("a", { href: href, text: text, class: cls || null, rel: isExternal(href) ? "noopener" : null });
  }
  function statusPill(status) {
    return el("span", { class: "status status--" + status, text: STATUS[status] || status });
  }

  var person = data.person || {};
  var links = data.links || {};
  var projects = (data.projects || []).filter(function (p) { return !p.draft; });
  var videos = (data.videos || []).filter(function (v) { return v.youtubeId || v.file; });
  var videoById = {};
  videos.forEach(function (v) { videoById[v.id] = v; });

  /* ---------- shared bindings (both pages) ---------- */
  var values = { availability: person.availability, email: person.email, updated: data.updated };
  document.querySelectorAll("[data-bind]").forEach(function (node) {
    var value = values[node.getAttribute("data-bind")];
    if (value) node.textContent = value;
  });
  if (person.email) {
    document.querySelectorAll("[data-bind-mailto]").forEach(function (node) {
      node.setAttribute("href", "mailto:" + person.email);
    });
  }
  // WhatsApp: digits only in data.js (country code, no + or spaces). Empty hides every WhatsApp link.
  var waNumber = String(person.whatsapp || "").replace(/\D/g, "");
  document.querySelectorAll("[data-bind-whatsapp]").forEach(function (node) {
    if (waNumber) node.setAttribute("href", "https://wa.me/" + waNumber);
    else (node.closest("[data-whatsapp-wrap]") || node).hidden = true;
  });
  document.querySelectorAll("[data-bind-href]").forEach(function (node) {
    var value = links[node.getAttribute("data-bind-href")];
    if (value) node.setAttribute("href", value);
    else node.parentElement.hidden = true;
  });

  var contactLinks = list("links");
  if (contactLinks) {
    [["LinkedIn", links.linkedin], ["GitHub", links.github], ["YouTube", links.youtube], ["Behance", links.behance], ["Notion", links.notion]]
      .forEach(function (pair) {
        if (pair[1]) contactLinks.appendChild(el("li", null, [link(pair[1], pair[0])]));
      });
    if (person.cvPdf) contactLinks.appendChild(el("li", null, [el("a", { href: person.cvPdf, download: "", text: "Download CV" })]));
  }

  var brandBox = $("[data-brand]");
  var brand = data.brand || {};
  if (brandBox && brand.logo) {
    brandBox.appendChild(el("img", { src: brand.logo, alt: brand.name || "", width: "130", height: "137", loading: "lazy" }));
    if (brand.note) brandBox.appendChild(el("p", { text: brand.note }));
    brandBox.hidden = false;
  }

  if (document.body.getAttribute("data-page") === "case") renderCase();
  else renderHome();

  /* =====================================================================
     Home page
     ===================================================================== */
  function renderHome() {
    var cvButton = $("[data-bind-cv]");
    if (cvButton && person.cvPdf) {
      cvButton.setAttribute("href", person.cvPdf);
      cvButton.setAttribute("download", "");
      cvButton.hidden = false;
    }

    /* Videos */
    var videoList = list("videos");
    if (videoList && videos.length) {
      videos.forEach(function (v) {
        videoList.appendChild(el("article", { class: "video" + (v.vertical ? " video--vertical" : ""), id: "video-" + v.id }, videoCaption(v)));
      });
      $("#videos").hidden = false;
      var navVideos = $('[data-nav="videos"]');
      if (navVideos) navVideos.hidden = false;
    }

    /* Projects, grouped */
    var projectList = list("projects");
    var groups = data.projectGroups && data.projectGroups.length ? data.projectGroups : [{ id: null, title: "", note: "" }];
    groups.forEach(function (g) {
      var items = projects.filter(function (p) { return g.id === null || p.group === g.id; });
      if (!items.length) return;
      var groupNode = el("section", { class: "project-group", "aria-labelledby": "group-" + g.id }, [
        g.title ? el("div", { class: "project-group__head" }, [
          el("h3", { class: "project-group__title", id: "group-" + g.id, text: g.title }),
          g.note ? el("p", { class: "project-group__note", text: g.note }) : null
        ]) : null
      ]);
      var rows = el("div", { class: "projects" });
      items.forEach(function (p) { rows.appendChild(projectRow(p)); });
      groupNode.appendChild(rows);
      projectList.appendChild(groupNode);
    });

    /* Creative */
    var creativeList = list("creative");
    var creative = data.creative || [];
    if (!creative.length) $("#creative").hidden = true;
    creative.forEach(function (c) {
      var figure = el("figure", { class: "creative__item" }, [
        el("img", { src: c.image, alt: "", loading: "lazy", width: "720", height: "1018" }),
        el("figcaption", { class: "creative__title", text: c.title })
      ]);
      creativeList.appendChild(c.link ? el("a", { class: "creative__link", href: c.link, rel: isExternal(c.link) ? "noopener" : null }, [figure]) : figure);
    });

    /* Experience */
    var timeline = list("experience");
    (data.experience || []).forEach(function (job) {
      timeline.appendChild(el("li", { class: "timeline__item" }, [
        el("p", { class: "timeline__when", text: job.when }),
        el("div", null, [
          el("h3", { class: "timeline__role", text: job.role }),
          el("p", { class: "timeline__org", text: job.org }),
          job.points && job.points.length
            ? el("ul", { class: "timeline__points" }, job.points.map(function (t) { return el("li", { text: t }); }))
            : null
        ])
      ]));
    });
    fillList("skills-using", (data.skills || {}).using);
    fillList("skills-learning", (data.skills || {}).learning);
    fillList("credentials", data.credentials);

    /* Hero demo: play once on load, replay on request */
    var demo = $("#demo");
    var replay = $(".replay");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (demo && !reduceMotion) {
      demo.classList.add("is-playing");
      if (replay) {
        replay.hidden = false;
        replay.addEventListener("click", function () {
          demo.classList.remove("is-playing");
          void demo.offsetWidth; // restart the CSS animations
          demo.classList.add("is-playing");
        });
      }
    }
  }

  function projectRow(p) {
    var l = p.links || {};
    var items = [];
    if (p.caseStudy) items.push(el("li", null, [link("case.html?p=" + encodeURIComponent(p.id), "Read the case study")]));
    if (l.live) items.push(el("li", null, [link(l.live, "Open live site")]));
    if (l.code) items.push(el("li", null, [link(l.code, "Read the code")]));
    if (l.notion) items.push(el("li", null, [link(l.notion, "Notion write-up")]));
    if (l.video && videoById[l.video]) items.push(el("li", null, [link("#video-" + l.video, "Watch the video")]));

    return el("article", { class: "project" + (p.confidential ? " project--compact" : ""), id: "project-" + p.id }, [
      el("div", { class: "project__status" }, [statusPill(p.status)]),
      el("div", { class: "project__body" }, [
        el("h4", { class: "project__title", text: p.title }),
        p.context ? el("p", { class: "project__context", text: p.context }) : null,
        el("p", { class: "project__summary", text: p.summary }),
        p.how ? el("p", { class: "project__how", text: p.how }) : null,
        p.stack && p.stack.length && !p.confidential
          ? el("p", { class: "project__stack" }, [el("span", { class: "project__stack-label", text: "Built with: " }), p.stack.join(", ")])
          : null,
        items.length ? el("ul", { class: "project__links" }, items) : null
      ]),
      p.image
        ? el("div", { class: "project__thumb" }, [el("img", { src: p.image, alt: p.imageAlt || "", loading: "lazy", width: "352", height: "416" })])
        : el("div", { class: "project__thumb", "aria-hidden": "true" })
    ]);
  }

  function youtubeUrl(v) {
    var id = encodeURIComponent(v.youtubeId);
    return v.vertical ? "https://www.youtube.com/shorts/" + id : "https://www.youtube.com/watch?v=" + id;
  }

  // Player, title and a "Watch on YouTube" link: used on the home page and on case-study pages.
  function videoCaption(v) {
    return [
      videoPlayer(v),
      el("p", { class: "video__title", text: v.title }),
      v.youtubeId ? el("p", { class: "video__more" }, [link(youtubeUrl(v), "Watch on YouTube")]) : null
    ];
  }

  function videoPlayer(v) {
    var frame = el("div", { class: "video__frame" + (v.vertical ? " video__frame--vertical" : "") });
    if (v.file) {
      frame.appendChild(el("video", { src: v.file, poster: v.poster || null, controls: "", preload: "metadata", playsinline: "" }));
      return frame;
    }
    // Load YouTube only when the visitor asks for it: faster page, no tracking until then.
    // With a poster (your own thumbnail), nothing loads from YouTube before play.
    var poster = v.poster || "https://i.ytimg.com/vi/" + encodeURIComponent(v.youtubeId) + "/hqdefault.jpg";
    var button = el("button", { class: "video__play", type: "button", "aria-label": "Play video: " + v.title }, [
      el("img", { src: poster, alt: "", loading: "lazy" }),
      el("span", { text: "Play video" })
    ]);
    button.addEventListener("click", function () {
      frame.replaceChild(el("iframe", {
        src: "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(v.youtubeId) + "?autoplay=1&rel=0&playsinline=1",
        title: v.title,
        allow: "autoplay; encrypted-media; picture-in-picture",
        allowfullscreen: ""
      }), button);
    });
    frame.appendChild(button);
    return frame;
  }

  function fillList(name, items) {
    var target = list(name);
    if (!target) return;
    (items || []).forEach(function (t) { target.appendChild(el("li", { text: t })); });
  }

  /* =====================================================================
     Case study page: case.html?p=<id>
     ===================================================================== */
  function renderCase() {
    var root = $("[data-case]");
    var id = new URLSearchParams(window.location.search).get("p");
    var withCases = projects.filter(function (p) { return p.caseStudy; });
    var p = withCases.filter(function (x) { return x.id === id; })[0];

    if (!p) {
      root.appendChild(el("div", { class: "case__missing" }, [
        el("h1", { class: "case__title", text: "That case study isn't here." }),
        el("p", null, ["Pick one from the ", link("index.html#work", "list of work"), "."])
      ]));
      return;
    }

    document.title = p.title + " | Bavly William";
    var c = p.caseStudy;
    var l = p.links || {};

    function section(title, body) {
      if (!body) return null;
      return el("section", { class: "case__section" }, [el("h2", { class: "case__h2", text: title }), body]);
    }
    function bullets(items) {
      return items && items.length ? el("ul", { class: "case__list" }, items.map(function (t) { return el("li", { text: t }); })) : null;
    }
    function pairs(items, a, b, labelA, labelB) {
      if (!items || !items.length) return null;
      return el("div", { class: "case__pairs" }, items.map(function (it) {
        return el("div", { class: "case__pair" }, [
          el("p", { class: "case__pair-a" }, [el("span", { class: "case__pair-label", text: labelA }), it[a]]),
          el("p", { class: "case__pair-b" }, [el("span", { class: "case__pair-label", text: labelB }), it[b]])
        ]);
      }));
    }
    function flow(steps) {
      if (!steps || !steps.length) return null;
      return el("ol", { class: "flow" }, steps.map(function (s) { return el("li", { class: "flow__step", text: s }); }));
    }

    var caseVideo = l.video ? videoById[l.video] : null;
    var linkItems = [];
    if (caseVideo) linkItems.push(el("li", null, [link("#case-video", "Watch the video")]));
    if (l.live) linkItems.push(el("li", null, [link(l.live, "Open live site")]));
    if (l.code) linkItems.push(el("li", null, [link(l.code, "Read the code")]));
    if (l.notion) linkItems.push(el("li", null, [link(l.notion, "Notion write-up")]));

    var decisionsBody = c.decisions && c.decisions.length
      ? el("div", { class: "case__pairs" }, c.decisions.map(function (d) {
          return el("div", { class: "case__decision" }, [
            el("h3", { class: "case__h3", text: d.choice }),
            el("p", { text: d.why })
          ]);
        }))
      : null;

    root.appendChild(el("article", { class: "case" }, [
      el("p", { class: "case__back" }, [link("index.html#work", "All work")]),
      el("header", { class: "case__head" }, [
        el("div", { class: "case__status" }, [statusPill(p.status)]),
        el("h1", { class: "case__title", text: p.title }),
        p.context ? el("p", { class: "case__context", text: p.context }) : null,
        el("p", { class: "case__summary", text: p.summary }),
        p.stack && p.stack.length ? el("p", { class: "project__stack" }, [el("span", { class: "project__stack-label", text: "Built with: " }), p.stack.join(", ")]) : null,
        linkItems.length ? el("ul", { class: "project__links" }, linkItems) : null
      ]),
      caseVideo ? el("section", { class: "case__section", id: "case-video" }, [
        el("h2", { class: "case__h2", text: "Watch it" }),
        el("div", { class: "case__video" + (caseVideo.vertical ? " case__video--vertical" : "") }, videoCaption(caseVideo))
      ]) : null,
      section("The problem", c.problem ? el("p", { class: "case__lead", text: c.problem }) : null),
      section("Constraints", bullets(c.constraints)),
      section("How it works", flow(c.flow)),
      section("Decisions and why", decisionsBody),
      section("What broke, and the fix", pairs(c.broke, "issue", "fix", "Problem: ", "Fix: ")),
      section("Results", bullets(c.results)),
      section("Limits", bullets(c.limits)),
      section("Next", bullets(c.next))
    ]));

    /* Next case study */
    var i = withCases.indexOf(p);
    var nextP = withCases[(i + 1) % withCases.length];
    if (nextP && nextP !== p) {
      root.appendChild(el("nav", { class: "case__next", "aria-label": "Next case study" }, [
        el("p", { class: "case__next-label", text: "Next case study" }),
        link("case.html?p=" + encodeURIComponent(nextP.id), nextP.title, "case__next-link")
      ]));
    }
  }
})();
