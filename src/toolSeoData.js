/**
 * SEO content for each tool page.
 * Each entry has: about (1-2 sentences), faqs (question + answer pairs).
 * Rendered by <ToolSeo path="..." /> at the bottom of every tool page.
 */
export const TOOL_SEO = {

  '/tools/word-counter': {
    about: 'A word counter tool counts words, characters, sentences, and paragraphs in any text. It is useful for writers, students, and content creators who need to meet specific length requirements.',
    faqs: [
      { q: 'How are words counted?', a: 'Words are split by whitespace. Any sequence of non-whitespace characters counts as one word.' },
      { q: 'Does it count characters with or without spaces?', a: 'Both — the tool shows character count with spaces and without spaces separately.' },
      { q: 'Is there a text length limit?', a: 'No limit. All processing happens in your browser so there is no server restriction.' },
    ],
  },
  '/tools/case-converter': {
    about: 'A case converter transforms text between uppercase, lowercase, title case, camelCase, snake_case, kebab-case, and more. It is essential for developers normalising variable names or writers fixing capitalisation.',
    faqs: [
      { q: 'What is camelCase?', a: 'camelCase joins words with no spaces and capitalises the first letter of each word except the first, e.g. myVariableName.' },
      { q: 'What is the difference between title case and sentence case?', a: 'Title case capitalises every major word. Sentence case only capitalises the first word.' },
      { q: 'Can I convert multiple lines at once?', a: 'Yes — paste any amount of text and the entire block is converted instantly.' },
    ],
  },
  '/tools/json-formatter': {
    about: 'A JSON formatter pretty-prints raw JSON with indentation and syntax highlighting, making it easy to read and debug. It also validates the JSON and reports errors on the exact line.',
    faqs: [
      { q: 'What does JSON formatting do?', a: 'It adds consistent indentation and line breaks so nested objects and arrays are visually clear instead of one long string.' },
      { q: 'Does this tool send my JSON to a server?', a: 'No — all formatting and validation runs in your browser. Your data never leaves your device.' },
      { q: 'Can I minify JSON here too?', a: 'Yes — use the minify option to strip all whitespace and produce a compact single-line output.' },
    ],
  },
  '/tools/diff-checker': {
    about: 'A diff checker compares two texts side by side and highlights added, removed, and unchanged lines. It is widely used by developers to review code changes and by writers to track edits.',
    faqs: [
      { q: 'What is a diff?', a: 'A diff is the set of differences between two versions of a text, showing exactly which lines were added or removed.' },
      { q: 'Can I compare code files?', a: 'Yes — paste any plain text including source code, JSON, or prose and the diff is shown instantly.' },
      { q: 'Is there a size limit?', a: 'No server limit. Very large texts may be slow depending on your device.' },
    ],
  },
  '/tools/qr-generator': {
    about: 'A QR code generator converts any URL or text into a scannable QR code image you can download. QR codes are used for sharing links, contact details, Wi-Fi passwords, and more.',
    faqs: [
      { q: 'What can I encode in a QR code?', a: 'Any text up to about 4,000 characters — URLs, plain text, email addresses, phone numbers, or Wi-Fi credentials.' },
      { q: 'What format is the downloaded image?', a: 'The QR code is downloaded as a PNG file you can print or embed anywhere.' },
      { q: 'Do QR codes expire?', a: 'QR codes generated here are static and never expire. They contain the raw data, not a redirect.' },
    ],
  },
  '/tools/password-generator': {
    about: 'A password generator creates strong, random passwords using a mix of letters, numbers, and symbols. Using a unique strong password for every account is the single most effective way to prevent account takeovers.',
    faqs: [
      { q: 'What makes a password strong?', a: 'Length is the most important factor, followed by character variety. A 16-character random password is extremely difficult to crack.' },
      { q: 'Are generated passwords stored anywhere?', a: 'No — passwords are generated entirely in your browser using the Web Crypto API and are never transmitted anywhere.' },
      { q: 'What is a passphrase?', a: 'A passphrase is several random words joined together. It is easier to remember than a random string but equally secure when long enough.' },
    ],
  },
  '/tools/unit-converter': {
    about: 'A unit converter lets you convert between different measurement systems including length, weight, temperature, speed, and area. It supports both metric and imperial units.',
    faqs: [
      { q: 'Which unit systems are supported?', a: 'Both metric (SI) and imperial/US customary units are supported across all categories.' },
      { q: 'How accurate are the conversions?', a: 'Conversions use standard internationally defined ratios and are accurate to many decimal places.' },
      { q: 'Can I convert temperature?', a: 'Yes — Celsius, Fahrenheit, and Kelvin are all supported with exact conversion formulas.' },
    ],
  },
  '/tools/base64': {
    about: 'A Base64 encoder/decoder converts binary data or text to a printable ASCII string and back. Base64 is commonly used to embed images in HTML, encode email attachments, and pass data through text-only systems.',
    faqs: [
      { q: 'What is Base64 encoding?', a: 'Base64 represents binary data using 64 printable characters (A–Z, a–z, 0–9, +, /). It increases data size by about 33% but makes binary safe to transmit as text.' },
      { q: 'What is the difference between Base64 and URL encoding?', a: 'Base64 encodes binary to text. URL encoding (percent-encoding) escapes special characters in URLs so they are transmitted correctly.' },
      { q: 'Is Base64 encryption?', a: 'No — Base64 is encoding, not encryption. Anyone can decode a Base64 string instantly. Do not use it to hide sensitive data.' },
    ],
  },
  '/tools/jwt-decoder': {
    about: 'A JWT decoder splits a JSON Web Token into its header, payload, and signature parts and displays them as readable JSON. It is an essential debugging tool for developers working with authentication systems.',
    faqs: [
      { q: 'What is a JWT?', a: 'A JSON Web Token (JWT) is a compact, URL-safe token format used to securely transmit information between parties as a JSON object signed with a secret or key pair.' },
      { q: 'Does decoding a JWT verify the signature?', a: 'Decoding only reads the payload. To verify the signature you need the secret key. This tool shows the contents but does not verify authenticity.' },
      { q: 'Is it safe to paste my JWT here?', a: 'All decoding runs in your browser — nothing is sent to any server. However, avoid sharing real production tokens in untrusted tools.' },
    ],
  },
  '/tools/regex-tester': {
    about: 'A regex tester lets you write a regular expression and test it against sample text with live match highlighting. It supports JavaScript regex syntax including flags like global, case-insensitive, and multiline.',
    faqs: [
      { q: 'What regex flavour does this use?', a: 'This tool uses JavaScript\'s built-in RegExp engine, which follows ECMAScript regex syntax.' },
      { q: 'What are regex flags?', a: 'Flags modify how a regex matches. Common flags: g (global — find all matches), i (case-insensitive), m (multiline — ^ and $ match line starts/ends).' },
      { q: 'How do I match a literal dot?', a: 'Escape it with a backslash: \\. — an unescaped dot matches any character.' },
    ],
  },
  '/tools/hash-generator': {
    about: 'A hash generator computes cryptographic hash values (SHA-1, SHA-256, SHA-512, MD5) for any input text. Hashes are used to verify file integrity, store passwords securely, and create digital fingerprints.',
    faqs: [
      { q: 'What is a cryptographic hash?', a: 'A hash function takes any input and produces a fixed-length output (digest). The same input always produces the same hash, but you cannot reverse a hash to get the original input.' },
      { q: 'Which algorithm should I use?', a: 'SHA-256 is the recommended general-purpose choice. MD5 and SHA-1 are considered broken for security purposes but are still used for checksums.' },
      { q: 'Does the input text get sent anywhere?', a: 'No — hashing runs entirely in your browser using the Web Crypto API.' },
    ],
  },
  '/tools/uuid-generator': {
    about: 'A UUID generator creates random version 4 UUIDs (Universally Unique Identifiers) in bulk. UUIDs are used as unique keys in databases, file names, session tokens, and distributed systems.',
    faqs: [
      { q: 'What is a UUID v4?', a: 'UUID v4 is randomly generated using 122 bits of randomness. The probability of a collision is astronomically low, making it safe to use as a unique identifier without a central authority.' },
      { q: 'Are UUIDs truly unique?', a: 'In practice, yes. The chance of two randomly generated v4 UUIDs colliding is about 1 in 5 undecillion.' },
      { q: 'What is the difference between UUID and GUID?', a: 'GUID (Globally Unique Identifier) is Microsoft\'s name for the same concept. They are interchangeable.' },
    ],
  },
  '/tools/age-calculator': {
    about: 'An age calculator computes the exact age between two dates in years, months, days, weeks, and total days. It is useful for birthday calculations, contract durations, and any date arithmetic.',
    faqs: [
      { q: 'How is age calculated exactly?', a: 'The tool counts full years, then remaining full months, then remaining days — accounting for varying month lengths and leap years.' },
      { q: 'Can I calculate the time between any two dates, not just birthdays?', a: 'Yes — set both the start and end dates to any dates you need.' },
      { q: 'Does it account for leap years?', a: 'Yes — February 29 is handled correctly when calculating across leap years.' },
    ],
  },
  '/tools/date-difference': {
    about: 'A date difference calculator finds the number of days, weeks, months, and years between any two dates. It is useful for project planning, calculating deadlines, and date arithmetic.',
    faqs: [
      { q: 'What is the difference between this and the age calculator?', a: 'The age calculator is optimised for birthdays and shows exact age. Date difference is general-purpose for any two arbitrary dates.' },
      { q: 'Are business days calculated separately?', a: 'Use the Working Days tool for business-day calculations. This tool counts calendar days.' },
    ],
  },
  '/tools/bmi': {
    about: 'A BMI calculator computes your Body Mass Index from your height and weight using the standard WHO formula. BMI is a common screening tool to categorise weight ranges.',
    faqs: [
      { q: 'What is a healthy BMI?', a: 'The WHO defines a healthy BMI as 18.5–24.9. Under 18.5 is underweight, 25–29.9 is overweight, and 30+ is obese.' },
      { q: 'Does BMI account for muscle mass?', a: 'No — BMI does not distinguish between fat and muscle. Athletes often have a high BMI despite low body fat. It is a screening tool, not a diagnostic one.' },
      { q: 'Does the tool support metric and imperial?', a: 'Yes — you can enter height in cm or feet/inches, and weight in kg or pounds.' },
    ],
  },
  '/tools/compound-interest': {
    about: 'A compound interest calculator shows how an investment grows over time when interest is reinvested. It is essential for understanding savings, retirement planning, and the long-term effect of different interest rates.',
    faqs: [
      { q: 'What is compound interest?', a: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods — interest on interest.' },
      { q: 'How does it differ from simple interest?', a: 'Simple interest is calculated only on the principal. Compound interest grows exponentially because each period\'s interest is added to the base.' },
      { q: 'What compounding frequency should I use?', a: 'Most savings accounts compound monthly or daily. Annual compounding is the most conservative estimate.' },
    ],
  },
  '/tools/gradient-generator': {
    about: 'A CSS gradient generator lets you build linear and radial gradients visually with colour stops and copy the generated CSS code. Gradients are used for backgrounds, buttons, and decorative elements.',
    faqs: [
      { q: 'What CSS gradient types are supported?', a: 'Linear gradients (directional) and radial gradients (circular/elliptical) — the two most common types in CSS.' },
      { q: 'Can I add more than two colour stops?', a: 'Yes — add as many colour stops as you need at any percentage position along the gradient.' },
      { q: 'Does the output work in all browsers?', a: 'Modern CSS gradients work in all current browsers without vendor prefixes.' },
    ],
  },
  '/tools/password-generator': {
    about: 'A password generator creates strong, random passwords using cryptographically secure randomness. Use a unique strong password for every account to prevent credential stuffing attacks.',
    faqs: [
      { q: 'What makes a password strong?', a: 'Length is the most important factor. A 16-character random password takes centuries to brute-force even with modern hardware.' },
      { q: 'Are passwords stored or logged?', a: 'No — passwords are generated using the Web Crypto API entirely in your browser and never sent anywhere.' },
    ],
  },
  '/tools/color-converter': {
    about: 'A color converter translates between HEX, RGB, HSL, and HSB colour formats. Designers and developers use it to convert colours between design tools and CSS code.',
    faqs: [
      { q: 'What is the difference between RGB and HSL?', a: 'RGB defines colour by red, green, and blue channel intensities. HSL defines it by hue (colour angle), saturation (intensity), and lightness — more intuitive for humans.' },
      { q: 'What is a HEX colour code?', a: 'A hex code like #FF5733 represents a colour as three pairs of hexadecimal digits for red, green, and blue channels.' },
    ],
  },
  '/tools/timestamp': {
    about: 'A Unix timestamp converter translates between Unix epoch timestamps and human-readable dates. Unix timestamps count seconds since January 1, 1970 (UTC) and are used in databases, APIs, and log files.',
    faqs: [
      { q: 'What is a Unix timestamp?', a: 'A Unix timestamp is the number of seconds elapsed since 00:00:00 UTC on 1 January 1970, known as the Unix epoch.' },
      { q: 'What is the year 2038 problem?', a: '32-bit signed integers storing Unix timestamps will overflow on 19 January 2038. Modern systems use 64-bit timestamps which extend far into the future.' },
      { q: 'Are timestamps in seconds or milliseconds?', a: 'Unix timestamps are traditionally in seconds. JavaScript uses milliseconds (multiply by 1000 to convert). This tool handles both.' },
    ],
  },
  '/tools/sql-formatter': {
    about: 'A SQL formatter prettifies SQL queries with consistent indentation, capitalised keywords, and aligned clauses. It makes complex queries easier to read, review, and maintain.',
    faqs: [
      { q: 'Which SQL dialects are supported?', a: 'Standard SQL keywords work for MySQL, PostgreSQL, SQLite, and MS SQL. Dialect-specific functions are formatted as identifiers.' },
      { q: 'Does formatting change the query logic?', a: 'No — formatting only changes whitespace and capitalisation. The query executes identically.' },
    ],
  },
  '/tools/markdown-preview': {
    about: 'A Markdown preview tool renders Markdown syntax as formatted HTML in real time. It supports headings, bold, italic, lists, links, code blocks, and blockquotes.',
    faqs: [
      { q: 'What is Markdown?', a: 'Markdown is a lightweight markup language using plain text symbols to indicate formatting — e.g. **bold**, # Heading, - list item.' },
      { q: 'Which Markdown flavour is used?', a: 'CommonMark-compatible Markdown covering the most widely supported subset of syntax.' },
    ],
  },
  '/tools/lorem-ipsum': {
    about: 'A Lorem Ipsum generator produces placeholder text for mockups, wireframes, and layout testing. It has been the standard dummy text in typesetting since the 1500s.',
    faqs: [
      { q: 'What does Lorem Ipsum mean?', a: 'It is scrambled Latin from Cicero\'s "de Finibus Bonorum et Malorum" (45 BC). The scrambled text has no real meaning — it is purely for visual layout.' },
      { q: 'Can I generate words, sentences, or paragraphs?', a: 'Yes — choose words, sentences, or paragraphs and set the exact quantity you need.' },
    ],
  },
  '/tools/pomodoro': {
    about: 'A Pomodoro timer helps you focus using the Pomodoro Technique — 25-minute work sessions followed by short breaks. It is one of the most popular productivity methods for reducing procrastination.',
    faqs: [
      { q: 'What is the Pomodoro Technique?', a: 'Developed by Francesco Cirillo in the 1980s, it breaks work into 25-minute focused sessions (Pomodoros) separated by 5-minute breaks. After four Pomodoros, take a longer 15-30 minute break.' },
      { q: 'Can I customise the session length?', a: 'Yes — work session, short break, and long break durations are all adjustable.' },
    ],
  },
  '/tools/image-resizer': {
    about: 'An in-browser image resizer lets you resize JPEG, PNG, and WebP images by dimensions or percentage without uploading to any server. Your images never leave your device.',
    faqs: [
      { q: 'Which image formats are supported?', a: 'JPEG, PNG, WebP, GIF, and most common browser-supported image formats.' },
      { q: 'Does resizing reduce image quality?', a: 'Reducing dimensions slightly reduces detail. The tool lets you control output quality for lossy formats like JPEG.' },
      { q: 'Is there a file size limit?', a: 'No server limit — but very large images may be slow on lower-powered devices since all processing is client-side.' },
    ],
  },
  '/tools/exif-viewer': {
    about: 'An EXIF viewer extracts metadata embedded in JPEG images — including camera model, shutter speed, aperture, ISO, GPS coordinates, and capture date. All processing is done locally in your browser.',
    faqs: [
      { q: 'What is EXIF data?', a: 'EXIF (Exchangeable Image File Format) is metadata embedded in photo files by cameras and smartphones, recording technical details about how the photo was taken.' },
      { q: 'Do photos shared on social media contain EXIF?', a: 'Most platforms (Facebook, Instagram, Twitter) strip EXIF data when you upload. However, photos shared directly via messaging apps often retain it.' },
      { q: 'Can EXIF reveal my location?', a: 'Yes — if GPS was enabled on your phone when the photo was taken, the EXIF data includes latitude and longitude. This is a privacy consideration when sharing original photos.' },
    ],
  },
  '/tools/css-minifier': {
    about: 'A CSS minifier removes comments, whitespace, and redundant characters from CSS files to reduce their size. Smaller CSS files load faster and improve page performance scores.',
    faqs: [
      { q: 'Does minification change how CSS works?', a: 'No — minification only removes characters that are not needed for the browser to parse and apply the styles.' },
      { q: 'How much smaller does CSS get after minification?', a: 'Typically 20–40% smaller. Files with many comments and verbose formatting see the largest reductions.' },
    ],
  },
  '/tools/css-formatter': {
    about: 'A CSS formatter prettifies minified or messy CSS with consistent indentation and line breaks, making stylesheets easy to read and maintain.',
    faqs: [
      { q: 'When would I use a CSS formatter?', a: 'When reading third-party minified CSS, onboarding to an unfamiliar codebase, or reviewing styles for debugging.' },
    ],
  },
  '/tools/html-minifier': {
    about: 'An HTML minifier strips comments, whitespace, and optional tags from HTML documents to reduce page size and improve load time.',
    faqs: [
      { q: 'Does HTML minification affect rendering?', a: 'No — browsers are designed to handle both verbose and minified HTML identically.' },
      { q: 'Should I minify HTML in development?', a: 'Only for production. Keep unminified HTML in development for readability and debugging.' },
    ],
  },
  '/tools/url-parser': {
    about: 'A URL parser breaks a URL into its component parts — protocol, hostname, port, path, query parameters, and fragment — displayed as structured JSON.',
    faqs: [
      { q: 'What are the parts of a URL?', a: 'A URL consists of: protocol (https), hostname (example.com), port (443), path (/page), query string (?key=value), and fragment (#section).' },
      { q: 'What is URL encoding?', a: 'Certain characters are not allowed in URLs and must be percent-encoded, e.g. a space becomes %20.' },
    ],
  },
  '/tools/cron-parser': {
    about: 'A cron parser translates cron expressions into plain English so you can verify a schedule is correct without memorising cron syntax. It also shows the next scheduled run times.',
    faqs: [
      { q: 'What is a cron expression?', a: 'A cron expression is a string of five or six fields defining a schedule: minute, hour, day-of-month, month, day-of-week (and optionally year).' },
      { q: 'What does * mean in cron?', a: 'An asterisk means "every" — so * in the minute field means "every minute".' },
      { q: 'How do I run a job every 15 minutes?', a: 'Use */15 in the minute field: */15 * * * *' },
    ],
  },
  '/tools/http-status': {
    about: 'An HTTP status code reference covers all standard codes from 100 to 599 with descriptions and common use cases. Bookmark it for quick lookups during API development and debugging.',
    faqs: [
      { q: 'What is the difference between 401 and 403?', a: '401 Unauthorized means the request lacks valid authentication credentials. 403 Forbidden means the server understood the request but refuses to authorise it — the user is authenticated but not permitted.' },
      { q: 'What does 429 mean?', a: '429 Too Many Requests — the client has sent too many requests in a given time and is being rate-limited.' },
      { q: 'What is a 2xx status code?', a: '2xx codes indicate success. 200 OK is the standard success response; 201 Created is returned after a successful POST that creates a resource.' },
    ],
  },
  '/tools/flexbox-playground': {
    about: 'A Flexbox playground lets you experiment with all CSS Flexbox properties visually and copy the resulting CSS. It is the fastest way to learn Flexbox or prototype a layout.',
    faqs: [
      { q: 'What is CSS Flexbox?', a: 'Flexbox (Flexible Box Layout) is a CSS layout model that makes it easy to align and distribute space among items in a container, even when their sizes are unknown.' },
      { q: 'When should I use Flexbox vs Grid?', a: 'Flexbox is best for one-dimensional layouts (a row or a column). CSS Grid is better for two-dimensional layouts (rows and columns simultaneously).' },
    ],
  },
  '/tools/fake-data-generator': {
    about: 'A fake data generator creates realistic test data — names, emails, addresses, phone numbers, and more — for use in development, testing, and database seeding.',
    faqs: [
      { q: 'Why use fake data instead of real data?', a: 'Using real personal data in development or test environments is a privacy and compliance risk. Fake data is realistic enough for testing without any risk.' },
      { q: 'Can I export the data?', a: 'Yes — copy the generated data as JSON or CSV.' },
    ],
  },
  '/tools/dns-lookup': {
    about: 'A DNS lookup tool queries DNS records (A, AAAA, MX, TXT, CNAME, NS) for any domain directly from your browser. It is useful for verifying DNS propagation, troubleshooting email delivery, and auditing domain configuration.',
    faqs: [
      { q: 'What is DNS?', a: 'DNS (Domain Name System) translates human-readable domain names like example.com into IP addresses that computers use to communicate.' },
      { q: 'What is an MX record?', a: 'An MX (Mail Exchange) record specifies the mail servers responsible for receiving email for a domain.' },
      { q: 'What is DNS propagation?', a: 'After changing DNS records, the update can take up to 48 hours to spread across all DNS servers worldwide. Use this tool to check if your changes have propagated.' },
    ],
  },
  '/tools/ssl-decoder': {
    about: 'An SSL certificate decoder parses a PEM-format X.509 certificate and displays its subject, issuer, validity dates, and Subject Alternative Names (SANs) in a readable format.',
    faqs: [
      { q: 'What is a PEM certificate?', a: 'PEM (Privacy Enhanced Mail) is a Base64-encoded format for certificates, bounded by -----BEGIN CERTIFICATE----- and -----END CERTIFICATE----- lines.' },
      { q: 'What are Subject Alternative Names?', a: 'SANs list all the domain names and IP addresses a certificate is valid for, including wildcards like *.example.com.' },
      { q: 'Does this tool verify the certificate against a server?', a: 'No — it only decodes the certificate you paste. To check a live server\'s certificate use your browser\'s padlock icon or a tool like SSL Labs.' },
    ],
  },
  '/tools/typing-speed': {
    about: 'A typing speed test measures your Words Per Minute (WPM) and accuracy by timing how fast you type a given text. Regular practice measurably improves typing speed for developers and writers.',
    faqs: [
      { q: 'What is a good typing speed?', a: 'The average typist is 40–60 WPM. Professional typists and fast developers typically reach 80–100 WPM. Top typists exceed 120 WPM.' },
      { q: 'How is WPM calculated?', a: 'WPM = (characters typed / 5) / minutes elapsed. Dividing by 5 normalises for average word length.' },
      { q: 'Does accuracy matter more than speed?', a: 'Yes — speed with poor accuracy is slower overall once corrections are factored in. Aim for 98%+ accuracy first, then build speed.' },
    ],
  },
  '/tools/ai-model-comparison': {
    about: 'An AI model comparison table shows the context window, pricing, strengths, and best use cases of leading large language models including GPT-4o, Claude, Gemini, and Llama side by side.',
    faqs: [
      { q: 'What is a context window?', a: 'A context window is the maximum amount of text (measured in tokens) that a model can process in a single request — including both the input and output.' },
      { q: 'What is a token?', a: 'A token is roughly 4 characters or ¾ of a word in English. Models are priced per thousand or million tokens processed.' },
      { q: 'Which model should I use?', a: 'It depends on the task. GPT-4o and Claude excel at complex reasoning. Gemini is strong on multimodal tasks. Llama models are free and self-hostable.' },
    ],
  },
  '/tools/token-counter': {
    about: 'A token counter estimates the number of tokens in any text for GPT, Claude, and Gemini models, and shows the approximate API cost. Use it to optimise prompts and avoid unexpected charges.',
    faqs: [
      { q: 'Why does token count matter?', a: 'LLM APIs charge per token. Knowing the token count of your prompts helps you optimise cost and stay within context window limits.' },
      { q: 'Are the counts exact?', a: 'Counts are estimates based on each model\'s known tokenisation rules. For GPT models the estimate is very close to the actual tiktoken count.' },
    ],
  },
  '/tools/prompt-improver': {
    about: 'A prompt improver analyses an AI prompt and rewrites it applying best-practice techniques — adding context, specifying format, clarifying tone, and removing ambiguity — to get better results from any LLM.',
    faqs: [
      { q: 'What makes a good AI prompt?', a: 'Good prompts are specific, provide context, define the desired output format, specify the audience, and give examples where helpful.' },
      { q: 'Does this work for ChatGPT, Claude, and Gemini?', a: 'Yes — the improved prompts follow general best practices that work across all major LLMs.' },
    ],
  },
  '/tools/meta-tag-generator': {
    about: 'A meta tag generator creates the HTML meta tags needed for SEO, Open Graph (Facebook/LinkedIn), and Twitter Card previews. Correct meta tags improve click-through rates and social sharing appearance.',
    faqs: [
      { q: 'What are Open Graph tags?', a: 'Open Graph tags (og:title, og:image, etc.) control how your page appears when shared on Facebook, LinkedIn, and other platforms.' },
      { q: 'How long should a meta description be?', a: 'Google typically shows 150–160 characters. Keep it under 160 and make it descriptive and action-oriented.' },
    ],
  },
  '/tools/digital-signature': {
    about: 'A digital signature tool lets you draw your handwritten signature using a mouse or touchscreen and download it as a transparent PNG, JPG, or SVG. It is useful for signing documents, adding signatures to PDFs, and creating email sign-offs.',
    faqs: [
      { q: 'Is this legally binding?', a: 'A drawn image signature is not a legally binding electronic signature under laws like eIDAS or ESIGN. For legally binding signatures use a dedicated e-signature service like DocuSign or Adobe Sign.' },
      { q: 'Can I use this on a phone or tablet?', a: 'Yes — the canvas supports touch input, so you can draw naturally with your finger or a stylus on any touchscreen device.' },
      { q: 'Which format should I download?', a: 'PNG with transparent background works best for placing your signature on documents or in design tools. JPG is smaller but has a white background. SVG embeds the PNG data and is useful in web contexts.' },
    ],
  },

  '/tools/text-splitter': {
    about: 'A text splitter divides any text or list into separate parts using a delimiter you choose — comma, newline, semicolon, or a custom string. It runs entirely in your browser with no data sent anywhere.',
    faqs: [
      { q: 'What delimiters can I use?', a: 'Comma, semicolon, new line, pipe, tab, space, or any custom string you type in.' },
      { q: 'Can I split CSV data?', a: 'Yes — choose comma as the delimiter and each cell value becomes a separate part. Enable "trim whitespace" to clean up spaces around values.' },
      { q: 'Is there a size limit?', a: 'No — all processing is done locally in your browser so there is no server-side restriction.' },
    ],
  },

  '/tools/character-remover': {
    about: 'A character remover strips or replaces any character or substring from text instantly. It supports plain text matching and case-sensitivity options, processing everything locally.',
    faqs: [
      { q: 'Can I remove all occurrences at once?', a: 'Yes — the tool removes or replaces every occurrence of the target string throughout the entire text.' },
      { q: 'Is this the same as Find & Replace?', a: 'Similar, but Character Remover is optimised for deletion. For full find-and-replace with regex support, use the Find & Replace tool.' },
    ],
  },

  '/tools/prefix-suffix': {
    about: 'A prefix/suffix adder prepends or appends text to every line in bulk. It is useful for wrapping SQL values in quotes, adding bullet points, building arrays, or prefixing lines with a label.',
    faqs: [
      { q: 'Can I add both a prefix and suffix at the same time?', a: 'Yes — fill in both fields and each line gets the prefix added at the start and the suffix added at the end simultaneously.' },
      { q: 'How do I wrap each line in quotes?', a: 'Set prefix to " and suffix to " — the tool wraps every line: "apple", "banana", "cherry".' },
    ],
  },

  '/tools/find-replace': {
    about: 'A find and replace tool searches for text and replaces it throughout your input — with support for regular expressions, whole-word matching, and case-sensitivity. All processing stays in your browser.',
    faqs: [
      { q: 'Can I use regular expressions?', a: 'Yes — enable the Regex checkbox to use JavaScript regex patterns. Capture groups like $1 work in the replacement field.' },
      { q: 'Does it replace all occurrences?', a: 'Yes — the global flag is always on, so every match is replaced. The result shows how many replacements were made.' },
      { q: 'What does whole-word matching do?', a: 'Whole-word matching adds word boundaries (\\b) around your search term, so searching "cat" won\'t match "catalog" or "concatenate".' },
    ],
  },

  '/tools/repeated-words': {
    about: 'A repeated words finder identifies overused words in any text and ranks them by frequency. It helps writers improve vocabulary variety in essays, blog posts, and reports.',
    faqs: [
      { q: 'What counts as a "repeated" word?', a: 'Any word appearing at least the minimum number of times you set (default: 2). Common words like "the", "and", "is" are filtered out by default.' },
      { q: 'Should I ignore common words?', a: 'Usually yes — common function words like "the", "a", "is" repeat naturally and are not a writing concern. Toggle off to see them too.' },
    ],
  },

  '/tools/text-joiner': {
    about: 'A text joiner combines multiple lines into a single line using a separator of your choice. It is ideal for building comma-separated lists, SQL IN clauses, and joining data for spreadsheets.',
    faqs: [
      { q: 'How do I build a SQL IN clause?', a: 'Set the separator to ", ", the wrap character to \', and your output becomes \'apple\', \'banana\', \'cherry\' — ready to paste into WHERE id IN (...).' },
      { q: 'Can I wrap each item in quotes?', a: 'Yes — enter a single quote or double quote in the "Wrap each item" field to wrap all joined items.' },
    ],
  },

  '/tools/truncate-text': {
    about: 'A text truncator trims text to a maximum number of characters, words, or lines and appends a custom ellipsis. Useful for generating previews, meta descriptions, and database field lengths.',
    faqs: [
      { q: 'Which truncation mode should I use?', a: 'Characters is best for database fields or meta tags with byte limits. Words is better for reading previews. Lines is useful for code or tabular data.' },
      { q: 'Can I customise the ellipsis?', a: 'Yes — replace the default "…" with any string, such as "[read more]", "...", or leave it blank for a hard cut.' },
    ],
  },

  '/tools/emoji-remover': {
    about: 'An emoji remover strips all emoji characters from text using Unicode property escapes, making it clean for plain-text systems, formal documents, and data processing pipelines.',
    faqs: [
      { q: 'Which emoji does it remove?', a: 'It removes Emoji_Presentation and Extended_Pictographic Unicode characters — covering all standard emoji including skin tone and ZWJ sequences.' },
      { q: 'Why would I need to remove emoji?', a: 'Some systems, databases, or document formats do not support emoji and will show garbled characters. Removing them first avoids encoding issues.' },
    ],
  },

  '/tools/alternating-case': {
    about: 'An alternating case converter transforms text to AlTeRnAtInG cAsE, sarcastic case, or inverted case using Unicode character-level manipulation. All conversion is instant and runs in your browser.',
    faqs: [
      { q: 'What is the difference between alternating and sarcastic case?', a: 'Alternating case flips every character starting from a fixed position. Sarcastic case (also called mock case) counts only letter positions, producing a more even alternation.' },
      { q: 'What does invert case do?', a: 'Invert case swaps the capitalisation of every letter — uppercase becomes lowercase and vice versa. Useful for quickly fixing accidentally typed text with Caps Lock on.' },
    ],
  },

  '/tools/text-padder': {
    about: 'A text padder left-pads, right-pads, or centres text to a target length using any character. It is used for aligning monospace output, generating fixed-width data, and formatting tables.',
    faqs: [
      { q: 'What is left-padding used for?', a: 'Left-padding is commonly used to zero-pad numbers (e.g. "007"), align columns in plain-text tables, and match fixed-width field formats in legacy systems.' },
      { q: 'Can I pad with a string instead of a single character?', a: 'Yes — enter any string as the pad character and it will be repeated and trimmed to fit the required padding length.' },
    ],
  },

  '/tools/number-to-words': {
    about: 'A number-to-words converter translates any integer into its English word form — cardinal (forty-two) and ordinal (forty-second). Supports numbers up to one quadrillion.',
    faqs: [
      { q: 'What is the difference between cardinal and ordinal?', a: 'Cardinal numbers count quantity: one, two, three. Ordinal numbers indicate position: first, second, third.' },
      { q: 'Does it support negative numbers?', a: 'Yes — negative numbers are prefixed with "negative", e.g. -5 becomes "negative five".' },
      { q: 'What is the maximum supported number?', a: 'Up to 999 trillion (999,999,999,999,999). Decimal numbers are not supported — whole integers only.' },
    ],
  },

  '/tools/discount-calculator': {
    about: 'A discount calculator computes final prices, savings amounts, and discount percentages. It works in three modes: percentage off, fixed amount off, and reverse (original + final to find the discount).',
    faqs: [
      { q: 'How do I find the original price from a discounted price?', a: 'Use the "Original + Final → Discount %" mode. Enter the original price and the price you paid, and the tool calculates the discount percentage and amount saved.' },
      { q: 'What is a discount percentage?', a: 'It is the fraction of the original price that is deducted. A 20% discount on £100 saves £20, giving a final price of £80.' },
    ],
  },

  '/tools/random-picker': {
    about: 'A random picker selects one or more items from any list using cryptographically seeded randomness. It is useful for raffles, team selection, random task assignment, and any decision-making scenario.',
    faqs: [
      { q: 'Is the selection truly random?', a: 'Yes — picks use Math.random() seeded by the JavaScript runtime, which is sufficiently random for everyday decisions and small raffles.' },
      { q: 'Can I pick multiple winners without repeats?', a: 'Yes — enable "pick multiple" and disable "allow duplicates" to select unique items without replacement.' },
      { q: 'Is there a limit on list size?', a: 'No hard limit — the tool handles thousands of items. All processing is client-side.' },
    ],
  },

  '/tools/number-sorter': {
    about: 'A number sorter arranges a list of numbers in ascending or descending order and provides summary statistics. It accepts numbers separated by commas, spaces, newlines, or semicolons.',
    faqs: [
      { q: 'What separators does it accept?', a: 'Commas, spaces, newlines, semicolons — or any mix. The tool auto-detects and splits on all of them.' },
      { q: 'Can I remove duplicates?', a: 'Yes — enable "remove duplicates" to keep only unique values in the sorted output.' },
      { q: 'Does it support decimal numbers?', a: 'Yes — decimal numbers like 3.14 or -2.5 are fully supported and sorted correctly.' },
    ],
  },

  '/tools/privacy-policy-generator': {
    about: 'A privacy policy generator creates a plain-English privacy policy template for websites and apps based on your inputs. It covers data collection, cookies, third-party sharing, and jurisdiction-specific rights.',
    faqs: [
      { q: 'Is this legally binding?', a: 'This tool generates a template for informational purposes only. It is not a substitute for legal advice. Consult a qualified lawyer for a policy specific to your situation.' },
      { q: 'Does it support GDPR?', a: 'Yes — select UK or EU jurisdiction and the generated policy includes a section on GDPR data subject rights (access, erasure, portability, etc.).' },
      { q: 'How do I use the generated policy?', a: 'Copy the text, review it carefully, customise any sections for your specific situation, and publish it on a dedicated Privacy Policy page on your site.' },
    ],
  },

  '/tools/world-clock': {
    about: 'A world clock displays the current time in multiple time zones simultaneously, updating every second. You can add any IANA time zone, remove ones you don\'t need, and choose 12 or 24-hour format.',
    faqs: [
      { q: 'How many time zones can I add?', a: 'As many as you like — the clock renders them in a responsive grid. The default set covers the most common global business time zones.' },
      { q: 'How do I find a specific city?', a: 'Search by city name or IANA identifier (e.g. America/Chicago, Europe/Berlin) in the add time zone field.' },
      { q: 'Does it update automatically?', a: 'Yes — all clocks tick in real time, updating every second using your device\'s system clock.' },
    ],
  },

  '/tools/simple-note': {
    about: 'Simple Note is a browser-based scratchpad that auto-saves your notes to local storage. It supports up to 10 notes with titles, word and character counts, and requires no account or internet connection.',
    faqs: [
      { q: 'Where are my notes saved?', a: 'Notes are saved exclusively in your browser\'s localStorage. They persist between sessions but are specific to the browser and device you use.' },
      { q: 'What happens if I clear my browser data?', a: 'Clearing cookies and site data will delete your notes. Export or copy important notes before clearing.' },
      { q: 'Is there a word limit?', a: 'No hard limit — localStorage can hold several megabytes of text. Very long notes may slow down the auto-save slightly.' },
    ],
  },

  '/tools/sequence-generator': {
    about: 'A sequence generator creates numeric sequences, letter ranges (A–Z), or custom lists with configurable step, prefix, suffix, and separator. It supports zero-padding and outputs up to 10,000 items.',
    faqs: [
      { q: 'Can I generate odd or even numbers only?', a: 'Yes — set start to 1 (or 2) and step to 2 to generate all odd (or even) numbers in the range.' },
      { q: 'Can I generate a descending sequence?', a: 'Yes — set start higher than end with a negative step, e.g. start 10, end 1, step -1.' },
      { q: 'What is zero-padding?', a: 'Zero-padding prefixes numbers with leading zeros so all items are the same width, e.g. 001, 002, ... 010, useful for file naming.' },
    ],
  },

  '/tools/flip-rotate-image': {
    about: 'A flip and rotate image tool lets you flip images horizontally or vertically and rotate them in 90° steps — all in your browser. Supports PNG, JPEG, and WebP output with adjustable quality.',
    faqs: [
      { q: 'Which image formats are supported?', a: 'You can upload JPEG, PNG, WebP, GIF, and most common browser-supported formats. Output can be saved as PNG, JPEG, or WebP.' },
      { q: 'Does flipping reduce image quality?', a: 'No — flipping and rotating are lossless canvas operations. Quality loss only occurs when saving as JPEG or WebP at less than 100%.' },
      { q: 'Is my image uploaded to a server?', a: 'No — all processing is done client-side using the HTML5 Canvas API. Your image never leaves your device.' },
    ],
  },

  '/tools/tone-generator': {
    about: 'A tone generator produces pure audio tones at any frequency using the Web Audio API. It supports sine, square, triangle, and sawtooth waveforms, adjustable volume, and displays the nearest musical note.',
    faqs: [
      { q: 'What is the range of supported frequencies?', a: 'From 20 Hz (lowest audible bass) to 20,000 Hz (upper limit of human hearing). The slider and input both accept values in this range.' },
      { q: 'What are the different waveforms?', a: 'Sine produces a pure, smooth tone. Square is bright and buzzy. Triangle is mellow. Sawtooth is harsh and rich — similar to a synthesiser.' },
      { q: 'Can I use this as a hearing test?', a: 'You can test frequency sensitivity informally, but this is not a calibrated audiological tool. For medical hearing tests, consult a qualified audiologist.' },
    ],
  },

  '/tools/character-counter': {
    about: 'A character counter provides detailed text statistics including total characters, letters, numbers, spaces, and symbols. It is useful for social posts, metadata, and copywriting constraints.',
    faqs: [
      { q: 'Does it count spaces?', a: 'Yes — it shows both total characters and a no-space character count.' },
      { q: 'Can I count multi-line text?', a: 'Yes — you can paste any multi-line text and counts update instantly.' },
    ],
  },
  '/tools/line-counter': {
    about: 'A line counter counts total lines, blank lines, and non-blank lines in any text. It helps developers and writers quickly audit structured content.',
    faqs: [
      { q: 'Can blank lines be excluded?', a: 'Yes — toggle whether blank lines are included in the final count.' },
      { q: 'What counts as a line?', a: 'Each newline-separated segment counts as one line.' },
    ],
  },
  '/tools/tabs-to-spaces': {
    about: 'A tabs-to-spaces converter transforms tab characters into spaces (or the reverse) using your chosen tab width. It helps keep code formatting consistent across editors.',
    faqs: [
      { q: 'What tab sizes are supported?', a: 'Common tab sizes like 2, 4, and 8 are supported.' },
      { q: 'Can it convert spaces back to tabs?', a: 'Yes — switch to spaces-to-tabs mode to reverse the conversion.' },
    ],
  },
  '/tools/comma-separator': {
    about: 'A comma separator converts line-based lists to comma-separated text and can split comma-separated lists back into lines. It is useful for CSV prep and quick data cleanup.',
    faqs: [
      { q: 'Can I use separators other than commas?', a: 'Yes — semicolon, pipe, and custom separator styles are supported.' },
      { q: 'Does it remove empty entries?', a: 'Yes — blank entries are trimmed out automatically.' },
    ],
  },
  '/tools/text-to-one-line': {
    about: 'Text to one line removes line breaks and joins content into a single continuous line. It is useful for form fields, configs, and log payloads.',
    faqs: [
      { q: 'Can extra spaces be cleaned too?', a: 'Yes — enable collapse mode to reduce repeated spaces.' },
      { q: 'Does it preserve word order?', a: 'Yes — only line breaks are replaced; text order remains unchanged.' },
    ],
  },
  '/tools/special-char-remover': {
    about: 'A special character remover strips punctuation and symbols from text while keeping letters and numbers. It is useful for sanitising datasets and preparing strict input formats.',
    faqs: [
      { q: 'Can spaces and line breaks be preserved?', a: 'Yes — you can choose whether to keep spaces and newlines.' },
      { q: 'What counts as special characters?', a: 'Characters outside letters, digits, and optional whitespace are treated as special.' },
    ],
  },
  '/tools/regex-replacer': {
    about: 'A regex replacer applies regular-expression search and replacement with support for flags and capture groups. It is ideal for advanced bulk text transformations.',
    faqs: [
      { q: 'Can I use capture groups in replacement?', a: 'Yes — use placeholders like $1, $2, etc.' },
      { q: 'Which flags are supported?', a: 'Standard JavaScript flags such as g, i, m, and s are supported.' },
    ],
  },
  '/tools/wrap-text': {
    about: 'A wrap text tool hard-wraps long lines at a chosen column width. It is useful for code comments, plain-text emails, and fixed-width output.',
    faqs: [
      { q: 'Can I set a custom wrap width?', a: 'Yes — choose any width within the supported range.' },
      { q: 'Does it preserve existing line breaks?', a: 'Yes — each line is wrapped independently.' },
    ],
  },
  '/tools/sales-tax': {
    about: 'A sales tax calculator adds tax to net prices or extracts tax from tax-inclusive totals. It quickly shows base amount, tax amount, and final amount.',
    faqs: [
      { q: 'Can it reverse-calculate from gross price?', a: 'Yes — use extract mode to compute net and tax from a tax-inclusive amount.' },
      { q: 'Is any specific country required?', a: 'No — enter any rate percentage used in your location.' },
    ],
  },
  '/tools/margin-calculator': {
    about: 'A margin calculator computes gross profit, margin percentage, and markup percentage from cost and selling price. It helps with pricing and profitability analysis.',
    faqs: [
      { q: 'What is margin vs markup?', a: 'Margin is profit divided by revenue; markup is profit divided by cost.' },
      { q: 'Can I use decimal values?', a: 'Yes — decimals are supported for both cost and selling price.' },
    ],
  },
  '/tools/gst-calculator': {
    about: 'A GST calculator adds or removes Goods and Services Tax from any price using a custom tax rate. It is useful for invoices, receipts, and e-commerce pricing.',
    faqs: [
      { q: 'Can I calculate GST from a gross amount?', a: 'Yes — extraction mode calculates net amount and GST component.' },
      { q: 'Can I use custom GST rates?', a: 'Yes — enter any GST rate percentage relevant to your region.' },
    ],
  },
  '/tools/area-calculator': {
    about: 'An area calculator finds the area of common geometric shapes including rectangle, circle, triangle, trapezoid, ellipse, and sector. It is useful for design, construction, and schoolwork.',
    faqs: [
      { q: 'Which shapes are supported?', a: 'Rectangle, circle, triangle, trapezoid, ellipse, and sector are supported.' },
      { q: 'What units are used?', a: 'Output is in square units matching whatever input unit you provide.' },
    ],
  },
  '/tools/prime-factorization': {
    about: 'A prime factorization tool decomposes an integer into its prime factors and exponents. It is useful for math education, number theory, and simplifying fractions.',
    faqs: [
      { q: 'What input range is supported?', a: 'Whole numbers from 2 up to one trillion are supported.' },
      { q: 'Does it show exponents?', a: 'Yes — repeated factors are grouped with exponent notation.' },
    ],
  },
  '/tools/sleep-calculator': {
    about: 'A sleep calculator suggests bedtimes or wake-up times based on 90-minute sleep cycles. It helps reduce grogginess by avoiding waking mid-cycle.',
    faqs: [
      { q: 'Why 90-minute cycles?', a: 'Typical adult sleep cycles average around 90 minutes, though individuals vary.' },
      { q: 'Does it account for falling asleep time?', a: 'Yes — it includes a default fall-asleep buffer in calculations.' },
    ],
  },
  '/tools/shoe-size': {
    about: 'A shoe size converter maps sizes between US, UK, EU, CM, and JP systems. It helps shoppers compare international size labels quickly.',
    faqs: [
      { q: 'Are sizes exact across all brands?', a: 'Not always — brand fit can vary, so use this as a standard reference.' },
      { q: 'Can it convert women and men US sizes?', a: 'Yes — both US men and US women reference columns are included.' },
    ],
  },
  '/tools/utm-builder': {
    about: 'A UTM builder creates campaign-tracking URLs by appending utm_source, utm_medium, utm_campaign, and other parameters. It is essential for analytics attribution.',
    faqs: [
      { q: 'Which UTM parameters are available?', a: 'Source, medium, campaign, term, and content are supported.' },
      { q: 'Can this be used with existing query parameters?', a: 'Yes — UTM parameters are appended correctly to URLs with or without existing query strings.' },
    ],
  },
  '/tools/list-to-array': {
    about: 'A list-to-array converter turns line-based items into array syntax for JavaScript, Python, PHP, Ruby, or CSV output. It saves time when preparing structured data.',
    faqs: [
      { q: 'Can I choose quote styles?', a: 'Yes — choose double quotes, single quotes, or no quotes.' },
      { q: 'Will blank lines be included?', a: 'No — blank lines are automatically skipped.' },
    ],
  },
  '/tools/port-checker': {
    about: 'A port checker tests whether a host port appears reachable from the browser. It provides quick best-effort diagnostics for common network troubleshooting.',
    faqs: [
      { q: 'Are browser port checks always accurate?', a: 'Not always — CORS and browser network restrictions can affect results.' },
      { q: 'What port range is supported?', a: 'Any TCP port from 1 to 65535 can be tested.' },
    ],
  },
  '/tools/terms-generator': {
    about: 'A terms and conditions generator creates a basic website terms template using your company and contact details. It helps launch legal pages faster.',
    faqs: [
      { q: 'Is this legal advice?', a: 'No — this is a template and should be reviewed by a legal professional.' },
      { q: 'Can I edit the generated terms?', a: 'Yes — copy and customise the output to your business needs.' },
    ],
  },
  '/tools/disclaimer-generator': {
    about: 'A disclaimer generator creates template disclaimers for general, affiliate, medical, and legal/financial use cases. It helps website owners publish core risk disclosures quickly.',
    faqs: [
      { q: 'Which disclaimer types are available?', a: 'General, affiliate, medical, and legal/financial templates are included.' },
      { q: 'Should I publish as-is?', a: 'Use it as a starting point and adapt it to your jurisdiction and services.' },
    ],
  },
  '/tools/subtitle-converter': {
    about: 'A subtitle converter transforms subtitle files between SRT and WebVTT formats. It is useful for video publishing workflows and web media compatibility.',
    faqs: [
      { q: 'Can I download the converted file?', a: 'Yes — you can download the output directly after conversion.' },
      { q: 'Are timestamps converted automatically?', a: 'Yes — timestamp delimiters are converted between comma and dot formats where needed.' },
    ],
  },
}
