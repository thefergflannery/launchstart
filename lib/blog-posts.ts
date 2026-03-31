export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  series: string;
  sections: Section[];
}

interface Section {
  heading?: string;
  headingLevel?: 2 | 3;
  body: string[];
  pullQuote?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'ten-accessibility-quick-wins',
    category: 'Accessibility',
    title: 'Is Your Website Leaving People Out? 10 Fixes You Can Ask For Today',
    excerpt: 'WCAG 2.2 AA compliance isn\'t just a legal obligation under the European Accessibility Act — it\'s a commercial opportunity. Here are 10 quick wins you can brief your web team on today.',
    date: 'Feb 2026',
    readingTime: '7 min',
    series: 'Web Accessibility for Irish Businesses · Article 1',
    sections: [
      {
        body: [
          'Here\'s a number that should make every business owner and marketing leader sit up: 1 in 6 people in Ireland lives with a disability. That\'s over 700,000 people, and when you include their families, carers, and close networks, the audience grows considerably larger.',
          'Now ask yourself honestly: could every single one of those people use your website without frustration? In most cases, the answer is no. Not because anyone intended to exclude them, but because accessibility gaps tend to be invisible to those who aren\'t affected by them.',
          'The good news? Many of the most impactful fixes are also the quickest. You don\'t need to understand code to spot these issues or to ask your team to fix them. You just need to know what to look for.',
          'Below are ten things that WCAG 2.2 AA requires, explained in plain English. For each one, I\'ll tell you what it means, what to ask your team, and what you\'re missing out on if it\'s not sorted.',
        ],
      },
      {
        heading: 'A note on the legal context in Ireland',
        headingLevel: 2,
        body: [
          'The European Accessibility Act (EAA) comes into full effect in Ireland on 28 June 2025. It requires that a wide range of products and services, including websites and apps, meet accessibility standards. This isn\'t a future concern. If your business isn\'t already working towards compliance, the deadline is closer than you think. The National Disability Authority (NDA) is Ireland\'s key resource for guidance, and WCAG 2.2 AA is the standard you\'ll need to meet.',
        ],
      },
      {
        heading: 'What is WCAG 2.2 AA?',
        headingLevel: 2,
        body: [
          'WCAG stands for Web Content Accessibility Guidelines. It\'s the international rulebook for making websites usable by everyone, including people with visual, hearing, motor, and cognitive differences. The "AA" level is the standard most organisations aim for, and with the EAA now in force across the EU, it carries real legal weight in Ireland. Think of it less as a compliance checkbox and more as a quality standard for your digital front door.',
        ],
      },
      {
        heading: '01. Your Text is Too Light to Read',
        headingLevel: 2,
        body: [
          'Imagine trying to read grey text on a white background on a bright day in Grafton Street. For people with low vision, colour blindness, or even just tired eyes, that\'s what a lot of websites feel like every day. WCAG sets a minimum level of contrast between text colour and background colour to ensure text is legible for the widest possible audience.',
          'What to ask your team: "Can you run a contrast check across our site, especially on body text, buttons, and form fields? Anything that fails the 4.5:1 ratio needs to be adjusted."',
          'What you\'re missing out on: Users with visual impairments will leave before they even read your offer. Low contrast also makes your site harder to use on mobile in daylight, affecting everyone, not just those with disabilities.',
        ],
      },
      {
        heading: '02. People Can\'t See Where They Are on the Page',
        headingLevel: 2,
        body: [
          'Many people can\'t use a mouse. They navigate websites using only a keyboard, or a switch device. As they move through a page, there should always be a visible highlight showing which button or link is currently selected. On most websites, this highlight has been deliberately removed because designers thought it looked untidy. WCAG 2.2 now has stronger rules requiring it to be clearly visible.',
          'What to ask your team: "Can someone navigate our entire website using only the Tab key on a keyboard? Can they always see clearly which element they\'re on?" If not, this needs fixing.',
          'What you\'re missing out on: Keyboard-only users, including many people with motor disabilities and power users who prefer shortcuts, will be unable to complete key actions like filling in forms, clicking CTAs, or checking out. You\'re losing conversions without ever knowing it.',
        ],
      },
      {
        heading: '03. Your Images Are Silent to Some Users',
        headingLevel: 2,
        body: [
          'Screen readers — the software used by blind and visually impaired users to browse the web — read out the content of a page aloud. When they reach an image, they read the image\'s "alternative text" or alt text, which is a brief description added behind the scenes. If it\'s missing, users hear something useless like "image3847.jpg". If it\'s vague, they hear "photo" or "banner". Neither tells them anything useful.',
          'What to ask your team: "Do all our images have meaningful alt text? Does the alt text describe what the image communicates, not just what it looks like? And do decorative images have empty alt text so screen readers skip them?"',
          'What you\'re missing out on: Good alt text is also read by search engines. Missing or poor alt text is a double loss. You\'re excluding users and losing SEO value from your images at the same time.',
        ],
      },
      {
        heading: '04. Your Page Has No Logical Reading Order',
        headingLevel: 2,
        body: [
          'Think of headings like a newspaper. There\'s a main headline, then section headers, then sub-sections. Screen reader users navigate pages by jumping between headings. It\'s how they skim content without reading every word. When headings are missing, the wrong size, or out of order, it\'s like a newspaper with no headlines. Users are lost before they start.',
          'What to ask your team: "Does every page have exactly one main heading? Do the subheadings follow a logical order, with main sections and then sub-sections, without any gaps? Are headings ever used just to make text look bigger, rather than to organise content?"',
          'What you\'re missing out on: Broken heading structure also affects your Google ranking. Search engines use headings to understand page structure. Fixing this is one of the rare cases where an accessibility improvement also directly supports your SEO.',
        ],
      },
      {
        heading: '05. Your Forms Are Confusing (And You\'re Losing Sign-Ups)',
        headingLevel: 2,
        body: [
          'Placeholder text is the light grey hint text that appears inside a form field before you type, like "Enter your email". The problem is that it disappears the moment someone clicks into the field. For users with memory difficulties, ADHD, or cognitive differences, losing that context mid-form is disorienting and frustrating. Labels — which are the text that sits permanently above or beside a field — should never be replaced by placeholder text alone.',
          'What to ask your team: "On all our forms, including contact forms, sign-up forms, and checkout, does every single field have a label that stays visible even after someone starts typing? Is placeholder text being used as a substitute for proper labels anywhere?"',
          'What you\'re missing out on: Form abandonment. Every confusing or inaccessible form field is a dropped lead, a lost purchase, or a frustrated customer. Fixing this improves conversion rates for all users, not just those with disabilities.',
        ],
        pullQuote: 'Open your website and try to complete a key task using only your keyboard — no mouse or trackpad. Tab moves forward, Shift+Tab moves back, Enter clicks. Can you do it? If you get stuck, that\'s a real accessibility barrier that\'s costing you users right now.',
      },
      {
        heading: '06. Some Features Only Work by Dragging',
        headingLevel: 2,
        body: [
          'Sliders, swipeable carousels, drag-to-reorder lists. These are common website features that require a precise dragging motion. For people with limited hand mobility, or anyone using a keyboard or switch device, dragging is difficult or impossible. WCAG 2.2 now explicitly requires that anything you can drag must also have a simpler click or tap alternative.',
          'What to ask your team: "Do we have any features on the site that require dragging? Price range sliders, image carousels, sortable lists? If yes, is there a button-based alternative that achieves the same result?"',
          'What you\'re missing out on: If your pricing tool, product filter, or booking interface relies on a drag interaction without an alternative, a significant portion of users simply cannot use it. That\'s a lost conversion you\'ll never see, because they\'ll leave without explaining why.',
        ],
      },
      {
        heading: '07. Keyboard Users Must Wade Through Your Navigation Every Single Time',
        headingLevel: 2,
        body: [
          'Every time a keyboard user loads a new page, they have to tab through your logo, every navigation link, and every header element before they reach the actual content. It\'s the equivalent of having to walk through the full entrance lobby every time you move between rooms. A "skip link" is a hidden shortcut that appears when keyboard users start navigating, letting them jump straight to the main content.',
          'What to ask your team: "Do we have a \'skip to main content\' link that appears when someone presses Tab for the first time on any page? This is a small addition but it makes a significant difference to keyboard users."',
          'What you\'re missing out on: Without this, keyboard users face a frustrating experience on every single page load. It\'s one of the fastest fixes available. A developer can add it in minutes, and the impact is disproportionately large.',
        ],
      },
      {
        heading: '08. Your Videos Have No Captions',
        headingLevel: 2,
        body: [
          'Captions are the text version of everything spoken and heard in a video, including dialogue, important sound effects, and speaker identification. WCAG requires accurate captions for all pre-recorded video content. Auto-generated captions are a helpful starting point but are frequently inaccurate, especially for Irish accents, place names, and industry-specific terms. They need human review before they can be considered compliant.',
          'What to ask your team: "Do all videos on our website have accurate, reviewed captions? Are they easy to turn on? Have they actually been checked, or are they raw auto-generated text that\'s never been corrected?"',
          'What you\'re missing out on: The majority of social video is watched without sound. Captions don\'t just help deaf and hard-of-hearing users. They increase watch time and comprehension for everyone. Uncaptioned video is leaving reach and engagement on the table, in addition to failing accessibility standards.',
        ],
      },
      {
        heading: '09. Your Login Process Is a Barrier',
        headingLevel: 2,
        body: [
          'CAPTCHAs — those "prove you\'re human" puzzles where you identify traffic lights or type distorted letters — are genuinely difficult for many people with visual impairments, dyslexia, cognitive disabilities, or anxiety. WCAG 2.2 introduced a new requirement: if you use a cognitive test to verify users, you must offer an accessible alternative. You cannot lock people out of your service because they can\'t read a blurry word.',
          'What to ask your team: "Does our login, sign-up, or checkout process include a CAPTCHA? If yes, what alternative do we offer for people who can\'t complete it? Could we replace it with a less intrusive verification method altogether?"',
          'What you\'re missing out on: CAPTCHAs frustrate everyone, not just people with disabilities. Research consistently shows they increase drop-off rates at sign-up and checkout. Removing or replacing them can lift conversion rates across your entire audience.',
        ],
      },
      {
        heading: '10. Interactive Elements Don\'t Behave as Expected',
        headingLevel: 2,
        body: [
          'When a website is built using proper, standardised building blocks, browsers and assistive technologies automatically know how to handle them. Screen readers announce elements correctly. Keyboards can operate them by default. But when developers build custom components that look like buttons or menus but aren\'t properly coded underneath, all of that breaks down.',
          'What to ask your team: "Can you run a free automated accessibility audit using a tool like Axe or WAVE and walk me through what it finds? Are our interactive components, including dropdowns, pop-ups, and custom buttons, properly labelled for screen readers?"',
          'What you\'re missing out on: This is often the root cause of the most serious accessibility failures. It is also far cheaper to get right during development than to fix afterwards. If you are commissioning new web work, ask for accessibility compliance as a condition of sign-off, not an afterthought.',
        ],
      },
      {
        heading: 'The Bottom Line: Accessibility is a Business Decision, Not Just a Compliance One',
        headingLevel: 2,
        body: [
          'Every item on this list represents a real group of real people who may be trying, and failing, to use your website right now. They\'re not complaining. They\'re just leaving. Quietly. And going to a competitor whose site works for them.',
          'With the European Accessibility Act now in force, Irish businesses have both a legal obligation and a genuine commercial opportunity. Organisations that invest in accessibility don\'t just reduce their legal exposure. They open their doors to a wider audience, build loyalty with an underserved market, and consistently find that improvements made for people with disabilities make the experience better for everyone.',
          'Better contrast helps anyone reading on a phone outdoors. Clear form labels reduce errors for every user. Skip links help keyboard power users who have no disability at all.',
          'You don\'t need to become an expert. You just need to start asking the right questions. The fixes exist. The standard is clear. The deadline has passed. The only question left is: who is your website actually for?',
        ],
      },
    ],
  },

  {
    slug: 'seven-free-accessibility-tools',
    category: 'SEO',
    title: '7 Essential Free Tools to Check Your Website\'s Accessibility (No Technical Knowledge Required)',
    excerpt: 'Automated scanners identify 30-40% of WCAG failures. Here are 7 free tools that surface the obvious issues quickly — from WAVE and Axe to screen reader testing with VoiceOver.',
    date: 'Jan 2026',
    readingTime: '7 min',
    series: 'Web Accessibility for Irish Businesses · Article 2',
    sections: [
      {
        body: [
          'If you read my last article on the 10 accessibility quick wins your website might be missing, you\'ll know that WCAG 2.2 AA compliance isn\'t just a legal obligation under the European Accessibility Act. It\'s a commercial opportunity that most Irish businesses are leaving on the table.',
          'But knowing what to fix is only useful if you can first find what\'s broken.',
          'The good news is that some of the most powerful accessibility testing tools in the world are completely free. They\'re used by developers, designers, and accessibility consultants every day, and many of them require zero technical knowledge to run.',
        ],
      },
      {
        heading: 'A quick note before you start',
        headingLevel: 2,
        body: [
          'No automated tool can catch every accessibility issue. Research consistently shows that automated scanners identify roughly 30 to 40 percent of WCAG failures. The rest require human judgement, real user testing, and manual checks. Think of these tools as your first line of investigation, not your final sign-off. They will surface the obvious, fixable issues quickly, which is exactly where you want to start.',
        ],
      },
      {
        heading: '01. WAVE by WebAIM',
        headingLevel: 2,
        body: [
          'WAVE is one of the most widely used accessibility evaluation tools in the world, and it\'s the best starting point for anyone new to accessibility testing. You can either visit wave.webaim.org and enter your website URL directly, or install the free browser extension for Chrome or Firefox and run it on any page with a single click.',
          'What it does: WAVE overlays icons and indicators directly on top of your webpage, showing you exactly where issues exist in context. Red icons indicate errors, yellow icons flag alerts worth investigating, and green icons confirm things that are working correctly.',
          'Why it\'s valuable for non-developers: You don\'t need to read a report or interpret a spreadsheet. The issues appear on the page itself, so you can see immediately what a screen reader user or keyboard user would encounter.',
          'What to do with it: Run WAVE on your homepage, your contact page, and your most important conversion page. Screenshot the results and share them with your developer or agency. Ask them to work through the red errors first.',
        ],
      },
      {
        heading: '02. Axe DevTools (Free Browser Extension)',
        headingLevel: 2,
        body: [
          'Axe, built by Deque Systems, is the accessibility testing engine that powers many professional auditing workflows. The free browser extension brings that same engine directly into your browser\'s developer tools. It is notable for having a zero false positives policy — meaning every issue it flags is a genuine problem, not a guess.',
          'What it does: Axe analyses the page you\'re viewing and produces a clear list of accessibility violations, organised by impact level: critical, serious, moderate, and minor. Each issue includes a plain English description, which WCAG criteria it violates, and guidance on how to fix it.',
          'Why it\'s valuable: Because it produces no false positives, the results are reliable. When you share an Axe report with a developer, every item on the list is genuinely worth fixing.',
          'What to do with it: Install the extension, open your browser\'s developer tools (usually by pressing F12), navigate to the Axe tab, and click Analyse. Export the results and use them as a prioritised fix list for your development team.',
        ],
      },
      {
        heading: '03. Silktide Accessibility Checker',
        headingLevel: 2,
        body: [
          'Silktide is a browser extension built with non-technical users firmly in mind. Where many accessibility tools present their findings in ways that assume coding knowledge, Silktide is designed to be understood by anyone, including marketing managers, content editors, and business owners who simply want to know what\'s wrong and why it matters.',
          'What it does: Silktide analyses the page you\'re on and presents issues in plain, jargon-free language. It groups findings by category, explains the real-world impact of each issue on actual users, and scores your page so you have a clear sense of where you stand.',
          'Why it\'s valuable: Silktide doesn\'t just tell you something is broken. It tells you what kind of person is affected, why it matters to them, and what the consequence is if it\'s left unfixed. For anyone making the business case for accessibility investment internally, that framing is genuinely useful.',
        ],
      },
      {
        heading: '04. Colour Contrast CC',
        headingLevel: 2,
        body: [
          'Contrast is one of the most common and most impactful accessibility failures on Irish websites. Colour Contrast CC is a clean, straightforward web tool that lets you check the contrast ratio between any two colours instantly, with no download or installation required.',
          'What it does: You enter or paste two hex colour codes — one for your text and one for your background — and the tool immediately calculates the contrast ratio between them. It tells you clearly whether the combination passes or fails WCAG AA and AAA standards for normal text, large text, and non-text elements.',
          'What to do with it: Find the hex codes for your main text colour and your background colour. Paste them into colourcontrast.cc and check the result. Then repeat for your call-to-action buttons, navigation links, and any coloured banners on your site. Anything that fails 4.5:1 for normal text needs to be flagged for adjustment.',
        ],
      },
      {
        heading: '05. Accessibility Insights for Web',
        headingLevel: 2,
        body: [
          'Accessibility Insights is Microsoft\'s free accessibility testing extension, and it offers something the other tools don\'t: a guided manual testing workflow called Assessment that walks you step by step through a complete WCAG audit — including the checks that automated tools simply cannot do.',
          'What it does: The tool has two modes. FastPass runs an automated check and highlights issues in seconds, similar to Axe. Assessment mode guides you through a structured series of manual checks, such as testing keyboard navigation and verifying that focus order makes logical sense.',
          'Why it\'s valuable: It bridges the gap between automated scanning and real human testing. The Assessment mode is particularly useful if you want to go deeper than a basic scan without needing to know WCAG inside out.',
        ],
      },
      {
        heading: '06. HeadingsMap',
        headingLevel: 2,
        body: [
          'Heading structure is one of the most commonly broken accessibility requirements and one of the easiest to overlook visually. HeadingsMap is a simple extension that extracts all the headings from any webpage and displays them as a structured outline, so you can immediately see whether the hierarchy makes sense.',
          'What it does: Click the extension icon on any page and a sidebar opens showing every heading in order, indented by level (H1, H2, H3, and so on). Missing levels, duplicate H1s, and illogical jumps in the hierarchy are immediately obvious.',
          'What to do with it: Run HeadingsMap on every key page of your site. You\'re looking for one H1 per page, logical nesting without skipping levels, and headings that reflect the actual content structure rather than visual styling choices.',
        ],
      },
      {
        heading: '07. Screen Reader Testing with NVDA or VoiceOver',
        headingLevel: 2,
        body: [
          'No automated tool can tell you what it actually feels like to use your website without vision. For that, you need a screen reader. NVDA (NonVisual Desktop Access) is a free, open-source screen reader for Windows. VoiceOver is built into every Mac, iPhone, and iPad and costs nothing to activate.',
          'What it does: A screen reader reads out everything on the screen, in the order the code presents it — including headings, links, buttons, images via alt text, form labels, and error messages. Using one on your own website is one of the most revealing things you can do.',
          'What to do with it: On a Mac, press Command + F5 to activate VoiceOver. On an iPhone, go to Settings > Accessibility > VoiceOver. On Windows, download NVDA free from nvaccess.org. Then try to navigate your homepage, find your contact information, and complete a form using only what you can hear.',
        ],
      },
      {
        heading: 'How to use these tools together',
        headingLevel: 2,
        body: [
          'You don\'t need to use all seven at once. A practical starting point for any Irish business: start with WAVE or Silktide if you\'re non-technical, or Axe if you want more precise, developer-ready output. Use HeadingsMap on your key pages to check structural issues that affect both accessibility and SEO. Use Colour Contrast CC to check any colour combinations that browser tools might miss.',
          'When you\'re ready to go deeper, use Accessibility Insights Assessment mode to work through manual checks, and turn on VoiceOver or NVDA to experience your site the way a screen reader user would.',
          'Document everything. Screenshots, scores, and tool reports give you evidence of where you started, what you improved, and how far you\'ve come. This matters both for your own records and for demonstrating compliance under the European Accessibility Act.',
        ],
      },
    ],
  },

  {
    slug: 'curb-cut-effect',
    category: 'Checklist',
    title: 'The Curb Cut Effect: Why Designing for Disability Makes Everything Better for Everyone',
    excerpt: 'The slope at the footpath wasn\'t designed for you. But you use it constantly. The same principle applies to every accessibility improvement on the web — and the return is systematically underestimated.',
    date: 'Jan 2026',
    readingTime: '5 min',
    series: 'Web Accessibility for Irish Businesses · Article 3',
    sections: [
      {
        body: [
          'There\'s a small feature on almost every footpath in Ireland that most of us have never consciously noticed. Where the footpath meets the road, instead of a sharp drop, there\'s a gentle slope. A dip. A smooth transition from one level to the other.',
          'You probably rolled a suitcase over one this week. Maybe you pushed a buggy across one. Perhaps you cycled over one without thinking, or appreciated one on a day your knees were sore, or used one to wheel in a delivery trolley.',
          'That slope was designed for wheelchair users.',
          'It wasn\'t designed for you. And yet here you are, using it constantly, your life made marginally but measurably easier by a design decision that was originally made with someone else in mind.',
          'This is the Curb Cut Effect. And once you understand it, you will never look at accessibility the same way again.',
        ],
      },
      {
        heading: '01. Captions on video',
        headingLevel: 2,
        body: [
          'For disabled users: Captions are essential for deaf and hard-of-hearing users who would otherwise have no access to spoken video content whatsoever.',
          'For everyone else: The majority of social media video is now watched without sound. Commuters, people in open-plan offices, anyone scrolling in a shared space. Captions also improve comprehension for people watching in their second language, help viewers follow technical or unfamiliar terminology, and make video content indexable by search engines, improving your reach organically.',
        ],
      },
      {
        heading: '02. Colour contrast',
        headingLevel: 2,
        body: [
          'For disabled users: Sufficient contrast between text and background is essential for people with low vision, colour blindness, and visual processing differences. Without it, content is simply unreadable for a significant portion of your audience.',
          'For everyone else: Most web browsing happens on mobile, outdoors, in variable light conditions. Strong contrast makes your content readable on a cracked screen in direct sunlight, in a dimly lit room at night, and everywhere in between. It also ages well. As people\'s eyesight naturally changes over time, higher contrast content remains legible when lower contrast content stops being so.',
        ],
      },
      {
        heading: '03. Plain language and clear structure',
        headingLevel: 2,
        body: [
          'For disabled users: People with cognitive differences, dyslexia, ADHD, and acquired brain injuries rely on clear, simply written content and logical page structure to understand and navigate information without unnecessary effort.',
          'For everyone else: Research consistently shows that the vast majority of web users skim rather than read. Short sentences, plain language, clear headings, and logical structure serve every user who is busy, distracted, reading quickly, or simply human. The legal profession learned this the hard way. Plain English contracts get fewer disputes. The same principle applies to every word on your website.',
        ],
      },
      {
        heading: '04. Keyboard accessibility',
        headingLevel: 2,
        body: [
          'For disabled users: People with motor disabilities, tremors, or conditions that make precise mouse control difficult or impossible depend entirely on keyboard navigation to move through a website and complete actions.',
          'For everyone else: Keyboard accessibility is what makes your site usable for power users who prefer shortcuts, professionals moving quickly between tools, and anyone using a smart TV, games console, or device without a traditional pointer. It also tends to reflect cleaner, better structured code underneath, which means faster load times and better search engine performance as a byproduct.',
        ],
      },
      {
        heading: '05. Logical heading structure',
        headingLevel: 2,
        body: [
          'For disabled users: Screen reader users navigate pages almost entirely by jumping between headings. A broken or missing heading structure makes a page effectively unusable for someone who cannot see the visual layout and relies on the underlying structure to understand what a page contains and where to go.',
          'For everyone else: Clear headings help every user skim a page and find what they need quickly. They also signal to search engines what a page is about and how it is organised, directly supporting SEO performance. A well-structured page ranks better, converts better, and serves every visitor more effectively.',
        ],
      },
      {
        heading: 'The pattern is not a coincidence',
        headingLevel: 2,
        body: [
          'Every one of these improvements was designed to remove a barrier for a specific group of people. Every one of them ended up making things better for a much wider audience. That is not luck. It is what happens when you design for the full range of human experience rather than the imagined average user sitting at a desktop in perfect conditions.',
          'The average user is a fiction. People use websites when they are tired, distracted, rushed, in poor light, on slow connections, on small screens, in noisy environments, and with varying levels of digital confidence. The edges of usability are not occupied only by people with diagnosed disabilities. They are occupied, at various times, by almost everyone.',
          'When you design for the edges, you design for reality.',
        ],
      },
      {
        heading: 'What this means for Irish businesses',
        headingLevel: 2,
        body: [
          'The European Accessibility Act is now in force in Ireland. For many businesses, the conversation about accessibility starts and ends with compliance. Something that needs to be sorted, budgeted for, and signed off.',
          'The curb cut effect reframes this entirely. Accessibility investment is not a cost you absorb to serve a minority. It is an improvement to your product that benefits your entire audience, lifts your search performance, reduces your legal exposure, and signals to every visitor that your organisation takes quality seriously.',
          'The return on accessibility investment is systematically underestimated because organisations only count the users they were explicitly designing for. They don\'t account for the much larger group who benefits quietly, every single day.',
          'The slope on the footpath wasn\'t designed for you. But it was there when you needed it. That is not a consolation prize for good ethics. That is what good design looks like.',
        ],
      },
    ],
  },

  // ─── Post 3 ───────────────────────────────────────────────────────────────
  {
    slug: 'what-is-the-european-accessibility-act',
    category: 'Compliance',
    title: 'What Is the European Accessibility Act — and Does It Apply to Your Business?',
    excerpt: 'The EAA came into force on 28 June 2025. Here\'s what it means in plain English, who it applies to, and what you actually need to do about it.',
    date: 'Mar 2026',
    readingTime: '6 min',
    series: 'Web Accessibility for Irish Businesses · Article 3',
    sections: [
      {
        body: [
          'If you\'ve received a letter about accessibility compliance, or seen the term "EAA" appearing more frequently in conversations about your website, this article is for you.',
          'The European Accessibility Act (EAA) — officially Directive (EU) 2019/882 — came into force across EU member states on 28 June 2025. It requires that a broad range of digital products and services be accessible to people with disabilities. In Ireland, it has been transposed into national law.',
          'This article explains what the EAA requires, which businesses it applies to, what "accessible" actually means in practice, and what you can do right now to get ahead of it.',
        ],
      },
      {
        heading: 'What does the EAA actually require?',
        headingLevel: 2,
        body: [
          'The EAA requires that digital services — including websites, mobile apps, e-commerce platforms, and digital documents — meet accessibility standards so they can be used by people with a wide range of disabilities, including visual, hearing, motor, and cognitive impairments.',
          'The technical standard underpinning the EAA is EN 301 549, which references WCAG 2.2 Level AA as the web accessibility baseline. In practical terms: if your website meets WCAG 2.2 AA, you are well on your way to EAA compliance.',
          'WCAG stands for Web Content Accessibility Guidelines. Level AA is the middle tier — not basic minimum, not exhaustive best practice. It covers the issues that most significantly affect real users: missing image descriptions, poor colour contrast, forms without labels, pages that can\'t be navigated by keyboard, and similar.',
        ],
      },
      {
        heading: 'Who does it apply to?',
        headingLevel: 2,
        body: [
          'The EAA applies to businesses that provide products or services in EU member states, including Ireland. There is a size threshold: micro-enterprises (fewer than 10 employees and annual turnover under €2 million) providing services are currently exempt from most requirements. However, if you supply products — hardware, software, devices — the exemption is narrower.',
          'In practice, the EAA applies to: e-commerce websites selling to customers in the EU, banking and financial services, transport services and booking platforms, streaming and media services, and software and app providers.',
          'If your business has a public-facing website that sells goods or services to customers in Ireland or elsewhere in the EU, you should treat the EAA as applicable to you.',
        ],
        pullQuote: 'If your business has a public-facing website that sells goods or services to customers in Ireland or the EU, you should treat the EAA as applicable.',
      },
      {
        heading: 'What happens if you don\'t comply?',
        headingLevel: 2,
        body: [
          'Member states are responsible for enforcement. In Ireland, enforcement mechanisms are being established through the relevant national authorities. Users can file complaints, and regulators can investigate and issue orders to bring products and services into compliance.',
          'More immediately practical: the reputational and commercial risk. As accessibility becomes better understood by consumers and businesses, a website that actively excludes users with disabilities is increasingly a liability — legally, commercially, and in terms of customer trust.',
          'Accessibility complaints and legal challenges under ADA in the US have been rising sharply for a decade. The EAA creates a similar legal framework across the EU.',
        ],
      },
      {
        heading: 'What is an accessibility statement, and do you need one?',
        headingLevel: 2,
        body: [
          'Yes. The EAA and related public sector regulations require organisations to publish an accessibility statement — a public declaration of how accessible your website is, what known issues remain, and how users can contact you if they encounter barriers.',
          'The statement should be published at a permanent URL (typically /accessibility-statement) and linked from your site footer. It should be reviewed and updated at least annually.',
          'An accessibility statement doesn\'t require your site to be perfect. It requires you to be honest about where you are, what you\'re doing about it, and how users can get help if they need it.',
        ],
      },
      {
        heading: 'What should you actually do right now?',
        headingLevel: 2,
        body: [
          'First, scan your website. A free accessibility scan will give you a clear picture of where you stand — no technical knowledge required. A11YO scans any URL and produces a plain English report that lists every issue, explains what it means for real users, and tells your developer exactly what to fix.',
          'Second, prioritise the critical issues. Not everything on an accessibility audit needs to be fixed immediately. Start with anything that actively blocks users: missing form labels, images with no descriptions, pages that break when using a keyboard. These are the issues most likely to affect the most people and carry the most legal weight.',
          'Third, publish an accessibility statement. Even a partially accessible website with an honest accessibility statement is in a better position than a website with no statement at all. Use A11YO\'s free accessibility statement generator to produce a compliant statement in under two minutes.',
          'Compliance with the EAA is not a one-time project. It\'s an ongoing commitment — the same way GDPR compliance isn\'t a form you fill in once. The businesses that treat it as a continuous process, rather than a deadline to meet and forget, are the ones that will stay ahead of enforcement.',
        ],
      },
      {
        heading: 'The bottom line',
        headingLevel: 2,
        body: [
          'The EAA is in force. It applies to most Irish businesses with a public-facing digital presence. The standard you need to meet is WCAG 2.2 AA. The first step is knowing where you stand.',
          'Scan your website for free at A11YO. You\'ll have a plain English report in under a minute — something you can read without Googling a single acronym, and hand straight to your developer.',
        ],
      },
    ],
  },

  // ─── Post 4 ───────────────────────────────────────────────────────────────
  {
    slug: 'five-most-common-accessibility-failures',
    category: 'Accessibility',
    title: 'The 5 Most Common Accessibility Failures on Irish Websites',
    excerpt: 'After scanning hundreds of Irish websites, these are the five issues that come up almost every time — and the plain English fix for each one.',
    date: 'Mar 2026',
    readingTime: '5 min',
    series: 'Web Accessibility for Irish Businesses · Article 4',
    sections: [
      {
        body: [
          'Accessibility failures are not evenly distributed. A small number of issues account for the vast majority of barriers that users with disabilities encounter online. The WebAIM Million — an annual study of the top one million websites — consistently finds that over 95% of home pages have detectable WCAG failures, and the same few issue types appear again and again.',
          'After scanning hundreds of Irish websites with A11YO, the pattern is the same here. Below are the five issues that come up most often, what they mean for real users, and what you need to ask your developer to do about them.',
        ],
      },
      {
        heading: '1. Images with no text description',
        headingLevel: 2,
        body: [
          'The issue: Images on the website have no alternative text — the short description that screen readers read aloud when a blind user reaches an image.',
          'What it means for users: A person using a screen reader hears nothing, or worse, hears the filename — something like "IMG_20240312_083421.jpg". They have no idea what the image shows or what it\'s trying to communicate.',
          'The fix: Every meaningful image on your site needs an alt attribute containing a short, plain English description of what the image shows. Decorative images (backgrounds, dividers) should have an empty alt attribute (alt="") so screen readers skip them.',
          'How common is it: WebAIM found missing or empty alt text on 39% of home pages in 2024. It is consistently the most frequently detected WCAG failure globally.',
        ],
        pullQuote: 'A screen reader user hears "IMG_20240312_083421.jpg". That is what a missing alt attribute sounds like.',
      },
      {
        heading: '2. Poor colour contrast',
        headingLevel: 2,
        body: [
          'The issue: Text on the website doesn\'t have enough contrast against its background, making it difficult or impossible to read for users with low vision, colour blindness, or anyone reading in bright sunlight.',
          'What it means for users: Pale grey text on a white background, or light green text on a dark green background, is invisible to a significant portion of your audience. Approximately 8% of men and 0.5% of women have some form of colour vision deficiency.',
          'The fix: WCAG 2.2 AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. Your designer or developer can check this using free tools — A11YO\'s colour contrast checker is one of them. The most common culprits are light grey placeholder text, small print, and text overlaid on images.',
          'This is often a quick design fix: darken the text colour slightly, or lighten the background. It doesn\'t require a redesign.',
        ],
      },
      {
        heading: '3. Form fields with no labels',
        headingLevel: 2,
        body: [
          'The issue: Input fields — name, email, phone, message — don\'t have visible labels or programmatic labels that screen readers can read.',
          'What it means for users: A screen reader user navigating to a text box hears "edit text". Nothing else. They have no idea what they\'re supposed to type into it. They cannot fill in your contact form, your checkout form, or your enquiry form.',
          'The fix: Every form field needs a label element that is explicitly associated with the input using a "for" attribute matching the input\'s ID. Placeholder text alone is not sufficient — it disappears when the user starts typing and isn\'t reliably read by all screen readers.',
          'Forms are one of the highest-stakes accessibility issues for businesses because they are the mechanism through which customers contact you, buy from you, and sign up with you. An inaccessible form is direct lost revenue.',
        ],
      },
      {
        heading: '4. No way to navigate by keyboard',
        headingLevel: 2,
        body: [
          'The issue: The website cannot be fully navigated using a keyboard alone — without a mouse or touch screen.',
          'What it means for users: Many users with motor impairments, tremors, or paralysis navigate entirely by keyboard, or use keyboard-based assistive technology like switch access. If your navigation menus, dropdowns, modals, or interactive elements can\'t be reached or operated by pressing Tab and Enter, these users are completely locked out.',
          'The fix: All interactive elements — links, buttons, form fields, menus, modals — must be reachable and operable by keyboard. There must also be a visible focus indicator: when you press Tab, you should be able to see which element is currently focused. Many websites deliberately remove the default browser focus ring for aesthetic reasons, which is a significant accessibility failure.',
          'Test this yourself: close your mouse, press Tab on your website, and see if you can get to every part of the page. If you can\'t, neither can users who depend on keyboard navigation.',
        ],
        pullQuote: 'Test this yourself: close your mouse, press Tab, and see if you can get to every part of the page.',
      },
      {
        heading: '5. Pages with no heading structure',
        headingLevel: 2,
        body: [
          'The issue: Page content is not organised using proper heading elements (H1, H2, H3), or headings are used for styling rather than structure.',
          'What it means for users: Screen reader users navigate pages by jumping between headings — it\'s how they skim and find what they need, just as sighted users scan a page visually. If there are no headings, or if the headings are in the wrong order, this navigation mechanism breaks entirely. A user lands on a long page of content with no way to find what they came for.',
          'The fix: Every page should have exactly one H1 (the main title). Subheadings should use H2. Sub-subheadings should use H3. Don\'t skip levels (H1 to H3 with no H2). Don\'t use headings just to make text bigger — use CSS for styling. The heading structure is an outline of the page\'s content, not a formatting tool.',
          'This is also one of the most significant SEO issues on the list. Search engines use heading structure to understand page content. A page with no H1 or a broken heading hierarchy is harder for Google to index correctly.',
        ],
      },
      {
        heading: 'What to do next',
        headingLevel: 2,
        body: [
          'The five issues above are not exotic edge cases. They are the baseline — the things that come up on almost every site we scan. Getting these right won\'t make your website perfect, but it will remove the most significant barriers for the most users.',
          'Scan your website free at A11YO. You\'ll get a plain English report showing exactly which of these issues exist on your site, how many instances were found, and what your developer needs to do to fix each one. No technical knowledge required — it\'s designed to be read by a business owner and handed straight to a developer.',
        ],
      },
    ],
  },

  // ─── Post 5 ───────────────────────────────────────────────────────────────
  {
    slug: 'how-to-write-an-accessibility-statement',
    category: 'Compliance',
    title: 'How to Write an Accessibility Statement (With a Free Template)',
    excerpt: 'An accessibility statement is a legal requirement under the EAA. Here\'s what it needs to contain, where to publish it, and how to generate one in under two minutes for free.',
    date: 'Mar 2026',
    readingTime: '5 min',
    series: 'Web Accessibility for Irish Businesses · Article 5',
    sections: [
      {
        body: [
          'An accessibility statement is a public declaration on your website that explains how accessible your site is, what known issues remain, and how users can contact you if they encounter barriers.',
          'Under the European Accessibility Act and related legislation, an accessibility statement is not optional. It\'s a required part of compliance — and publishing one, even before your site is fully accessible, demonstrates good faith and a commitment to improvement.',
          'This article explains what a compliant accessibility statement must contain, where to publish it, and how to generate one for free using A11YO\'s accessibility statement generator.',
        ],
      },
      {
        heading: 'What does an accessibility statement need to contain?',
        headingLevel: 2,
        body: [
          'A compliant accessibility statement under the EAA and EN 301 549 must include the following:',
          'Your conformance status: is your site fully conformant, partially conformant, or non-conformant with the relevant standard (typically WCAG 2.2 AA)? Be honest. "Partially conformant" with an explanation is better than a false claim of full compliance.',
          'The standards you\'re referencing: WCAG 2.2 AA, EN 301 549, or any national legislation that applies (e.g. EAA Directive 2019/882 if you operate in the EU).',
          'Known limitations: a list of specific accessibility issues you are aware of and haven\'t yet resolved. This is important. It demonstrates that you\'ve actually assessed your site, and it gives users advance notice of barriers they may encounter.',
          'Contact information: how users can report accessibility issues and request accessible alternatives. This must include an email address (at minimum) and a commitment to respond within a reasonable timeframe — typically 5 working days.',
          'The date the statement was prepared or last reviewed.',
        ],
      },
      {
        heading: 'Formal exclusions — what content can you exempt?',
        headingLevel: 2,
        body: [
          'The EAA includes specific categories of content that organisations can formally exclude from accessibility requirements. These are not loopholes — they are defined in the legislation with specific conditions. The main categories are:',
          'Third-party content: content you did not fund, develop, or control — for example, an embedded Google Map or a social media feed widget. You can note this as out of scope.',
          'Archived documents: documents published before the EAA\'s accessibility deadline that are not needed for active processes. Older PDFs that are kept for historical reference, not active use, may qualify.',
          'Live media: live audio or video streams at the time of broadcast. Pre-recorded content does not qualify.',
          'If any of these apply to your site, your accessibility statement should explicitly list them and explain why they fall under the relevant exclusion.',
        ],
      },
      {
        heading: 'What is a disproportionate burden claim?',
        headingLevel: 2,
        body: [
          'Under the EAA, organisations can claim "disproportionate burden" for specific content where making it fully accessible would require resources grossly out of proportion to the benefit provided. This is not a blanket opt-out — it requires a formal assessment and must be documented.',
          'If you are making a disproportionate burden claim, your accessibility statement must include a description of the content in question, an explanation of why remediation would be disproportionately burdensome, and a commitment to review the assessment annually.',
          'Disproportionate burden claims are legitimate in specific circumstances — a small organisation with a large archive of legacy PDFs, for example. They are not appropriate as a substitute for routine accessibility fixes.',
        ],
        pullQuote: 'A disproportionate burden claim is not a blanket opt-out. It requires a formal assessment, documented in your accessibility statement.',
      },
      {
        heading: 'Where do you publish it?',
        headingLevel: 2,
        body: [
          'Publish your accessibility statement at a permanent, predictable URL. The convention is /accessibility-statement on your domain. Link to it from your site footer on every page.',
          'It should be published on the same domain as the website it describes — not a third-party hosted page. It should be accessible itself: readable without JavaScript, usable by screen readers, with sufficient colour contrast.',
          'Review and update it at least once a year, or whenever you make significant changes to your site. The date on the statement should reflect the last time it was genuinely reviewed, not just created.',
        ],
      },
      {
        heading: 'Generate one for free in under two minutes',
        headingLevel: 2,
        body: [
          'A11YO\'s free accessibility statement generator takes your organisation details, conformance level, applicable standards, known issues, and contact information, and produces a ready-to-publish plain text statement.',
          'It covers EAA 2025, EN 301 549, WCAG 2.2 AA, ADA, Section 508, AODA, and the Accessible Canada Act. It includes fields for formal exclusions (with the correct legal language for each EAA Article 14 category), disproportionate burden claims, and full contact details including phone and postal address.',
          'No account required. Fills in under two minutes. Copy and paste directly to your website.',
        ],
      },
      {
        heading: 'A statement is a commitment, not a certificate',
        headingLevel: 2,
        body: [
          'An accessibility statement is not a certificate of compliance. It doesn\'t mean your site is perfect. It means you\'ve assessed your site, you\'re transparent about where it stands, and you\'ve committed to improving it and supporting users who encounter barriers.',
          'That commitment — backed by an actual contact email that someone responds to — is what regulators, users, and customers are looking for. A website with an honest accessibility statement is in a fundamentally better position than one that either ignores the issue or makes false claims of full compliance.',
          'Start with the statement. Fix the critical issues. Update the statement to reflect your progress. That is the whole process.',
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
