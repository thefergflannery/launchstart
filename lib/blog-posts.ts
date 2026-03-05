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
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
