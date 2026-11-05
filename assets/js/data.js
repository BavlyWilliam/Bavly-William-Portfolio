/*
  ============================================================
  THIS IS THE ONLY FILE YOU EDIT TO UPDATE THE PORTFOLIO.
  ============================================================
  Same idea as clients.json in your WhatsApp logger: the content lives
  here, and the code that draws the pages (render.js) never changes.

  To add a project: copy one block inside `projects`, change the text,
  put its image in assets/img/, save, commit, push.
  Give it a `caseStudy` block and it automatically gets its own page
  at case.html?p=<id>.

  Honesty rules:
  - `status` must be something you can defend in an interview:
      "live"      people use it today
      "working"   runs end to end, not in daily use
      "prototype" proves the idea, rough edges
      "progress"  being built now
  - `draft: true` hides a project from the site until you remove it.
    Use it for anything whose facts you haven't confirmed yet.
  - Every number must match your CV.
  - Internal work tools (`confidential: true`) never show internal
    data, screenshots, system names or customer names.

  Empty strings ("") hide that link, button or item automatically.
*/

window.PORTFOLIO = {
  updated: "November 2026",

  person: {
    name: "Bavly William",
    role: "AI implementation and automation",
    location: "Cairo, Egypt",
    email: "bavlywilliamwork@gmail.com",
    // Put your CV at assets/cv/Bavly-William-CV.pdf, then set this to that path:
    cvPdf: "",
    availability:
      "Open to remote AI automation roles, relocation to the UAE or Qatar, and freelance builds for small businesses."
  },

  // Freelance brand. Shown in the contact section on every page. Set logo to "" to hide it.
  brand: {
    name: "BAV Automations",
    logo: "assets/img/bav-automations-logo.svg",
    note: "Freelance builds run under my studio name, BAV Automations."
  },

  links: {
    github: "https://github.com/BavlyWilliam",
    linkedin: "https://www.linkedin.com/in/bavly-william-b5a27822a",
    behance: "https://www.behance.net/bavlywilliam",
    // Set this only after the Notion page has no draft notes or private case studies under it:
    notion: ""
  },

  // The Work section shows these groups in this order.
  projectGroups: [
    {
      id: "work",
      title: "At work",
      note:
        "Tools I built for my own team at Concentrix on the Microsoft account, the final line of escalation support for Microsoft partners, while carrying the team's highest case volume at a 99.1% quality score. Described without internal data, screenshots or system names."
    },
    {
      id: "independent",
      title: "Independent projects",
      note:
        "Built hands-on with AI coding agents (Claude Code). Public code is on GitHub; private repositories are available on request."
    }
  ],

  projects: [
    /* ---------------- At work (Concentrix, Microsoft account) ---------------- */
    {
      id: "ai-taxonomy",
      group: "work",
      confidential: true,
      title: "AI case taxonomy agent",
      context: "Copilot Studio",
      status: "live",
      summary:
        "Categorises incoming cases against a written rule set, so every case lands in the same category no matter who handles it.",
      how:
        "An AI agent built in Copilot Studio. The rules live in an Excel sheet, so they can be updated without rebuilding the agent.",
      stack: ["Copilot Studio", "Excel"]
    },
    {
      id: "copilot-agent",
      group: "work",
      confidential: true,
      title: "Team knowledge agent",
      context: "Microsoft Copilot",
      status: "live",
      summary:
        "Answers partner-management questions from the team's own knowledge, removing an estimated 20% of recurring manual work.",
      how: "Internal Microsoft Copilot agent built on team guidance, with standardised workflows for repeat requests.",
      stack: ["Microsoft Copilot"]
    },
    {
      id: "case-assignment",
      group: "work",
      confidential: true,
      title: "Fair case assignment",
      context: "Excel VBA",
      status: "live",
      summary:
        "Assigns every incoming case fairly across the team, matching each case to the right language, severity and line of business.",
      how:
        "Rule-based VBA. The assignment rules are fixed, so I kept AI out of it: the result is predictable, easy to audit, and costs nothing per case.",
      stack: ["Excel", "VBA"]
    },
    {
      id: "call-intake",
      group: "work",
      confidential: true,
      title: "Standard call-intake form",
      context: "HTML form",
      status: "live",
      summary:
        "Gives every call the same note structure, so details aren't skipped and manual-entry errors are avoided.",
      how:
        "An HTML form with fixed fields that turns each call into standardised notes, instead of free text.",
      stack: ["HTML", "JavaScript"]
    },
    {
      id: "reporting-model",
      group: "work",
      confidential: true,
      title: "Team reporting data model",
      context: "Power Query and Power BI, for team leadership",
      status: "live",
      summary:
        "A refreshable KPI view for team leadership, replacing reports that had to be consolidated by hand.",
      how: "Power Query data model feeding a Power BI dashboard.",
      stack: ["Power Query", "Power BI"]
    },
    {
      id: "report-export",
      group: "work",
      confidential: true,
      title: "Legacy report export",
      context: "JavaScript",
      status: "live",
      summary: "Cut a recurring report from about 2 hours to under 10 minutes.",
      how: "A JavaScript workaround that added data export and date filtering to a legacy internal system.",
      stack: ["JavaScript"]
    },

    /* ---------------- Independent projects ---------------- */
    {
      id: "whatsapp",
      group: "independent",
      title: "WhatsApp purchase logger",
      context: "Freelance client, small business",
      status: "working",
      summary:
        "Selenium drives WhatsApp Web directly in Firefox, classifies every message in the client's purchase group, writes each purchase to Google Sheets, and turns the data into a business analysis: top spender against budget, top vendor and top-spending project.",
      how:
        "A rule-based parser reads the standard template. Messages it can't read go to Gemini, and the answer passes the same validator before anything is written. Each client has its own sheet, token and log.",
      stack: ["Python", "Selenium", "Google Sheets API", "OAuth", "Gemini API"],
      image: "",
      imageAlt: "",
      links: {
        code: "https://github.com/BavlyWilliam/Whatsapp-accounting-automation",
        live: "",
        notion: "",
        video: "whatsapp-explainer"
      },
      caseStudy: {
        problem:
          "Staff at a small business report purchases in a dedicated WhatsApp group. The owner needed every purchase in a spreadsheet, by person, to compare spending against budget.",
        constraints: [
          "Free or close to free to run.",
          "Staff keep using WhatsApp. No new app, no new habit.",
          "Messages are typed by people: typos, missing fields, Arabic and English.",
          "Runs on a Windows PC."
        ],
        flow: [
          "WhatsApp group",
          "Selenium driving WhatsApp Web in Firefox",
          "Classify the message",
          "Template parser",
          "Validator",
          "AI fallback (Gemini), then the validator again",
          "Google Sheet",
          "Analysis: top spender against budget, top vendor, top-spending project"
        ],
        decisions: [
          {
            choice: "Drive WhatsApp Web directly with Selenium in Firefox",
            why: "No paid WhatsApp API and no third-party service: it reads the group the client already uses. Firefox proved more reliable than Chrome for this in an earlier WhatsApp project."
          },
          {
            choice: "Rules first, AI second",
            why: "A regex parser reads well-formed messages for free and the same way every time. Only messages it can't read go to Gemini, which keeps cost and surprises down."
          },
          {
            choice: "Never trust the model's answer",
            why: "Whatever Gemini returns passes the same validator as a typed template, so a model mistake can't write a bad row. AI rows are marked 'ai' in the sheet for spot checks."
          },
          {
            choice: "Take buyer and date from WhatsApp, not from the message",
            why: "The sender's contact name is the buyer and the message timestamp is the date, so staff type less and can't get those two wrong."
          },
          {
            choice: "No keyword required",
            why: "The group exists only for purchases, so any message with item, quantity and amount counts. One less thing for staff to remember."
          },
          {
            choice: "One config block per client",
            why: "Each client has its own group, sheet, token and log in clients.json, so a new client is configuration, not new code."
          }
        ],
        broke: [
          {
            issue: "Restarting the script skipped messages sent while it was off.",
            fix: "Saved state between runs and reconciled against the sheet, so a restart picks up where it stopped."
          },
          {
            issue: "Google access expired every 7 days.",
            fix: "Published the OAuth app, which removes the 7-day token expiry that applies to apps in testing."
          },
          {
            issue: "The listener silently read the wrong chat.",
            fix: "It now checks the chat header after opening the group and on every polling cycle, and stops loudly on a mismatch instead of logging someone else's messages."
          }
          // Uncomment after you purge the old state file from the git history:
          // ,{
          //   issue: "An early test state file with real contacts had been committed to the public repository.",
          //   fix: "Purged it from the git history and blocked state files in .gitignore so it can't happen again."
          // }
        ],
        results: [
          "Runs end to end: message in, validated row in the client's sheet.",
          "The logged data answers the owner's real questions: who spends most against their budget, which vendor gets the most money, and which project costs the most.",
          "Handles typos in field names through the AI fallback, with every AI row validated and labelled."
        ],
        limits: [
          "WhatsApp's terms restrict unofficial automation, so this suits a business's own groups, not mass use.",
          "It reads only messages loaded on screen.",
          "Identical messages from one sender in the same minute count as one.",
          "It runs while the PC is on. There is no server yet."
        ],
        next: [
          "Move saved state from JSON files to SQLite.",
          "Run it as a Windows background task so it survives restarts.",
          "Replace print-style checks with a pytest test suite."
        ]
      }
    },
    {
      id: "audio-companion",
      group: "independent",
      title: "Parla Italiano audio companion",
      context: "For a printed Italian course book",
      status: "live",
      summary:
        "Book owners scan a QR code printed in the book and get every unit's audio on their phone. No app, no account, no download.",
      how:
        "Static site on GitHub Pages with audio streamed from Cloudflare R2. Each unit has its own link, so a QR code can open a specific lesson.",
      stack: ["HTML", "JavaScript", "GitHub Pages", "Cloudflare R2", "Python"],
      image: "assets/img/cover-a2.webp",
      imageAlt: "Cover of the Parla Italiano A2 course book",
      links: {
        code: "https://github.com/BavlyWilliam/Audio-Books-website",
        live: "https://bavlywilliam.github.io/Audio-Books-website/",
        notion: "",
        video: ""
      },
      caseStudy: {
        problem:
          "Students of a printed Italian course book needed the audio for every unit on their phones. Apps, accounts and large downloads all lose people before they press play.",
        constraints: [
          "Must play on cheap Android phones and on iPhones.",
          "QR codes are printed, so a link can never change once a book is sold.",
          "Hosting cost close to zero."
        ],
        flow: [
          "QR code in the book",
          "Static page on GitHub Pages",
          "Unit link (#unit-07)",
          "Audio streamed from Cloudflare R2",
          "Student's phone"
        ],
        decisions: [
          {
            choice: "A static site with no backend",
            why: "Nothing to maintain or patch, and GitHub Pages hosts it for free."
          },
          {
            choice: "Audio on Cloudflare R2, not in the repository",
            why: "Keeps large files out of git and streams them to the browser."
          },
          {
            choice: "MP3 at 64 kbps mono",
            why: "Plays on both iPhone and Android and loads quickly on mobile data. Speech doesn't need more."
          },
          {
            choice: "Never break a printed link",
            why: "When I added the new A1 and A2 pages, the original A1 page stayed at the same address, so QR codes already printed in books still work."
          },
          {
            choice: "No cookies, no tracking",
            why: "Students scan and listen. Nothing else."
          }
        ],
        broke: [],
        results: [
          "Live and used by people who own the printed book.",
          "A1 (10 units) and A2 (12 units) audio pages, each unit reachable from its own QR code.",
          "Narration produced with my voice-clone kit from the teacher's own recording, with his permission."
        ],
        limits: ["No usage numbers yet, because the site deliberately has no tracking."],
        next: ["First-party QR scan counts on Cloudflare Workers and D1 (designed, not built), so usage can be measured without third-party trackers."]
      }
    },
    {
      id: "parla-system",
      group: "independent",
      title: "Parla Italiano marketing, creative and AI sales assistant",
      context: "Live language-course business I co-run. I own everything except the teaching.",
      status: "progress",
      summary:
        "I run the marketing: the content strategy and calendar, the creative assets and videos, the social pages and the Meta ads. I also audited more than 100 sales chats and built an AI sales assistant for Messenger.",
      how:
        "The assistant answers 330 tested scenarios without calling a model, and passes only what those don't cover to Gemini 3.1, which keeps token costs down. Approved by Meta; production hosting is in progress, so it doesn't answer customers yet.",
      stack: ["Content strategy", "Meta Ads", "Creative production", "Python", "Gemini API"],
      image: "assets/img/cover-a1.webp",
      imageAlt: "Cover of the Parla Italiano A1 course book",
      links: {
        code: "",
        live: "",
        notion:
          "https://app.notion.com/p/Parla-Italiano-Building-an-end-to-end-learning-and-sales-experience-404b29d974f781cdaeb2f79785ba122a",
        video: ""
      },
      caseStudy: {
        problem:
          "An Italian course business needed a full growth system around the teaching: a brand, content people want to watch, paid ads that bring the right students, and sales chats that actually close.",
        constraints: [
          "Small ad budget.",
          "Sales happen in chat, mostly on WhatsApp and Messenger, where tracking is weak.",
          "Prices and promises must be exactly right in every reply."
        ],
        flow: [
          "Content strategy and publishing calendar",
          "Creative assets and videos",
          "Rebranded Facebook page, new Instagram page",
          "Meta ads",
          "Sales chats",
          "Sales assistant: scripted scenarios first, Gemini 3.1 fallback, human handoff",
          "A1 and A2 books"
        ],
        decisions: [
          {
            choice: "Own the whole funnel, not just the ads",
            why: "Ads only work if the content, the page they land on and the reply in the chat all hold up, so I planned and produced all of it."
          },
          {
            choice: "Audit the chats before automating them",
            why: "Reading more than 100 sales chats showed slow first replies and prices that were never sent. A bot that answers badly faster would not fix that, so a reply playbook and a lead tracker came first."
          },
          {
            choice: "Scripted answers first, AI second",
            why: "330 tested scenarios are answered without a model. Only questions they don't cover go to Gemini 3.1, which keeps token costs down and keeps the common answers exactly right."
          },
          {
            choice: "Price guardrails and a human handoff",
            why: "The assistant must never invent a price or a promise. Anything outside what it is allowed to say goes to a person."
          }
        ],
        broke: [
          {
            issue: "Production hosting failed after Meta approved the app.",
            fix: "Still open. The assistant runs locally until hosting is fixed."
          }
        ],
        results: [
          "Content strategy, creative assets, videos, rebranded social pages and Meta campaigns, all planned and produced by me.",
          "Redesigned A1 and A2 books, with a QR-linked audio companion.",
          "More than 100 sales chats audited. In a detailed sample of 31, the median first reply was 2 hours 20 minutes and 15 of 26 ad-driven chats never received a price.",
          "A 25-scenario reply playbook and a lead tracker (New, Qualified, Paid, Lost with reason).",
          "In the audited ad period, WhatsApp-button ads cost about 2.50 EGP per chat against 9.63 EGP on Messenger."
        ],
        limits: [
          "Campaign figures describe the audited period. They are diagnostic and claim no sales lift.",
          "The sales assistant is not answering customers yet."
        ],
        next: [
          "Host the assistant and compare first-reply time and price-sent rate against the audit baseline."
        ]
      }
    },
    {
      id: "orchestrator",
      group: "independent",
      title: "AI model orchestrator",
      context: "Personal project",
      status: "prototype",
      summary:
        "Takes a request, asks follow-up questions when something important is missing, and recommends an AI model with its reasons, using live benchmark data.",
      how:
        "Python command-line tool using Gemini structured outputs (Pydantic), benchmark data from the Artificial Analysis API, and a SQLite history of every run.",
      stack: ["Python", "Gemini API", "Pydantic", "SQLite"],
      image: "assets/img/orchestrator-architecture.webp",
      imageAlt: "Architecture diagram of the AI model orchestrator",
      links: {
        code: "https://github.com/BavlyWilliam/AI-Orchestrator",
        live: "",
        notion: "",
        video: ""
      },
      caseStudy: {
        problem:
          "Picking an AI model for a task usually means guessing, or using one model for everything regardless of cost, speed or quality.",
        constraints: [
          "Recommendations must come with reasons, not just a name.",
          "Benchmarks change, so the data has to be live.",
          "Every decision should be traceable afterwards."
        ],
        flow: [
          "User request",
          "Clarify missing information",
          "Analyse requirements",
          "Score and optionally improve the prompt",
          "Score models with benchmark data and constraints",
          "Recommend with reasons",
          "Log to SQLite"
        ],
        decisions: [
          {
            choice: "Structured outputs with Pydantic",
            why: "Gemini's answers are parsed into typed objects and rejected if they don't fit, instead of scraping free text."
          },
          {
            choice: "Ask before guessing",
            why: "If something that changes the answer is missing, the tool asks a clarifying question first."
          },
          {
            choice: "SQLite with foreign keys and parameterised queries",
            why: "Requests, analyses and recommendations are linked and queryable, and parameters keep user text out of the SQL itself."
          }
        ],
        broke: [],
        results: [
          "Working command-line prototype with live benchmark data and a full history of runs."
        ],
        limits: ["Recommendations depend on what the benchmark data covers."],
        next: ["Evaluate recommendations against a labelled set of tasks."]
      }
    },
    {
      id: "voice-kit",
      group: "independent",
      title: "Voice clone kit",
      context: "Personal project, used to produce the course audio",
      status: "working",
      summary:
        "Clones a voice from a 1 to 2 minute recording and reads any text in 23 languages. Runs on your own PC, and nothing is uploaded.",
      how:
        "Local Gradio app on the open-source Chatterbox models, with a consent step and an automatic quality check on every result.",
      stack: ["Python", "Gradio", "PyTorch"],
      image: "",
      imageAlt: "",
      links: {
        code: "https://github.com/BavlyWilliam/Voice-Clonning-project.",
        live: "",
        notion: "",
        video: ""
      },
      caseStudy: {
        problem:
          "The course needed narration for 22 units in the teacher's voice, without hours of studio recording or uploading his voice to a paid service.",
        constraints: [
          "Runs on a Windows PC, free.",
          "Nothing leaves the machine.",
          "The speaker must agree to having their voice cloned."
        ],
        flow: [
          "1 to 2 minute recording",
          "Pick the best 10-second clip",
          "Create the voice",
          "Type text, choose tone and language",
          "Quality check",
          ".wav or .mp3"
        ],
        decisions: [
          {
            choice: "Local and open source",
            why: "Built on Chatterbox (MIT licence), so there's no subscription and no recording is uploaded anywhere."
          },
          {
            choice: "Consent built in",
            why: "A voice can't be created until the consent box is ticked."
          },
          {
            choice: "Check every output",
            why: "Each result is scored for how close it sounds to the voice and whether every word was actually spoken, so bad takes are caught before anyone hears them."
          },
          {
            choice: "A short install path on Windows",
            why: "PyTorch's files break Windows' 260-character path limit in deep folders, so the setup script installs to a short path."
          }
        ],
        broke: [],
        results: ["Used to produce the A1 and A2 course audio, with the teacher's permission."],
        limits: ["Windows only. Real time with an NVIDIA GPU, several times slower on CPU."],
        next: []
      }
    }
  ],

  /*
    Videos: upload to YouTube (Public or Unlisted) and paste the ID,
    the part after "v=" in the link. Or put a short .mp4 (under 50 MB)
    in assets/video/ and set `file`. Videos with neither are hidden,
    and the whole section stays hidden until one has a source.
  */
  videos: [
    { id: "whatsapp-explainer", title: "How the WhatsApp purchase logger works", youtubeId: "", file: "" },
    { id: "video-2", title: "Second video title", youtubeId: "", file: "" },
    { id: "video-3", title: "Third video title", youtubeId: "", file: "" }
  ],

  /*
    Creative work: link each image to its Behance project page.
    Export images about 900px wide as .webp into assets/img/.
  */
  creative: [
    { title: "Parla Italiano A2 book cover", image: "assets/img/cover-a2.webp", link: "https://www.behance.net/bavlywilliam" },
    { title: "Parla Italiano A1 book cover", image: "assets/img/cover-a1.webp", link: "https://www.behance.net/bavlywilliam" }
  ],

  experience: [
    {
      when: "Jul 2025 – now",
      role: "Relationship Manager, Microsoft account",
      org: "Concentrix Egypt",
      points: [
        "Final line of escalation support for Microsoft partners. Built the tools listed under At work.",
        "Now also own team reporting and training material.",
        "Carried the team's highest case volume, about three times a typical Relationship Manager's, while holding a 99.1% quality score."
      ]
    },
    {
      when: "Dec 2025 – Jul 2026",
      role: "Account Manager, AI-enabled operations",
      org: "Klover (contract)",
      points: [
        "Turned Arabic localisation of layered social-media templates for a UAE brand into a repeatable workflow using Claude."
      ]
    },
    {
      when: "Mar 2025 – Jul 2025",
      role: "Team Leader",
      org: "Radisson Hotel Group",
      points: [
        "Led and coached a team of 20.",
        "Built a quality framework that stayed in use after handover, and rebuilt daily reporting in Power Query, saving about an hour a day."
      ]
    },
    {
      when: "Mar 2022 – Mar 2025",
      role: "Pre-Sales Cloud Specialist, Microsoft account",
      org: "Concentrix Egypt",
      points: ["Advised small and mid-size businesses on Azure and Microsoft 365."]
    },
    {
      when: "Sep 2020 – Mar 2022",
      role: "Sales Support and Seller Support",
      org: "Concentrix Egypt, TripAdvisor and Amazon accounts",
      points: []
    }
  ],

  skills: {
    using: [
      "Python, Selenium, Google Sheets API",
      "LLM APIs (Claude, Gemini) with structured outputs and validation",
      "Guardrails and human handoff for chatbots",
      "SQLite: schema design, parameterised queries",
      "REST APIs, webhooks, JSON",
      "Excel, VBA, Power Query, Power BI, Power Automate",
      "Microsoft Copilot and Copilot Studio agents",
      "HTML, JavaScript, GitHub Pages, Cloudflare R2"
    ],
    learning: ["Automated testing", "Deployment and hosting", "Cloud beyond the fundamentals"]
  },

  credentials: [
    "Microsoft 365 Fundamentals (MS-900)",
    "Anthropic Academy: AI Fluency, Claude 101",
    "Bachelor of Commerce, Ain Shams University",
    "Italian Diploma in Electrical Engineering, Don Bosco Institute, Cairo",
    "Arabic (native), English (fluent), Italian (fluent)"
  ]
};
