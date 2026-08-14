import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

// Original 8
import WordCounter        from './pages/tools/WordCounter'
import CaseConverter      from './pages/tools/CaseConverter'
import JsonFormatter      from './pages/tools/JsonFormatter'
import DiffChecker        from './pages/tools/DiffChecker'
import QrGenerator        from './pages/tools/QrGenerator'
import PasswordGenerator  from './pages/tools/PasswordGenerator'
import UnitConverter      from './pages/tools/UnitConverter'
import Base64Tool         from './pages/tools/Base64Tool'

// Text
import LoremIpsum         from './pages/tools/LoremIpsum'
import TextRepeater       from './pages/tools/TextRepeater'
import StringReverse      from './pages/tools/StringReverse'
import DuplicateRemover   from './pages/tools/DuplicateRemover'
import LineSort           from './pages/tools/LineSort'
import MarkdownPreview    from './pages/tools/MarkdownPreview'
import SlugGenerator      from './pages/tools/SlugGenerator'
import WordFrequency      from './pages/tools/WordFrequency'
import TextToBinary       from './pages/tools/TextToBinary'
import MorseCode          from './pages/tools/MorseCode'
import PalindromeChecker  from './pages/tools/PalindromeChecker'
import AnagramChecker     from './pages/tools/AnagramChecker'
import WhitespaceRemover  from './pages/tools/WhitespaceRemover'
import EmailExtractor     from './pages/tools/EmailExtractor'
import UrlExtractor       from './pages/tools/UrlExtractor'
import NumberExtractor    from './pages/tools/NumberExtractor'

// Developer
import HtmlEntities       from './pages/tools/HtmlEntities'
import JwtDecoder         from './pages/tools/JwtDecoder'
import RegexTester        from './pages/tools/RegexTester'
import ColorConverter     from './pages/tools/ColorConverter'
import TimestampConverter from './pages/tools/TimestampConverter'
import CssMinifier        from './pages/tools/CssMinifier'
import CssFormatter       from './pages/tools/CssFormatter'
import JsMinifier         from './pages/tools/JsMinifier'
import HtmlMinifier       from './pages/tools/HtmlMinifier'
import HtmlToMarkdown     from './pages/tools/HtmlToMarkdown'
import MarkdownToHtml     from './pages/tools/MarkdownToHtml'
import XmlFormatter       from './pages/tools/XmlFormatter'
import XmlToJson          from './pages/tools/XmlToJson'
import JsonToXml          from './pages/tools/JsonToXml'
import JsonToCsv          from './pages/tools/JsonToCsv'
import CsvToJson          from './pages/tools/CsvToJson'
import YamlToJson         from './pages/tools/YamlToJson'
import JsonToYaml         from './pages/tools/JsonToYaml'
import SqlFormatter       from './pages/tools/SqlFormatter'
import CronParser         from './pages/tools/CronParser'
import UrlParser          from './pages/tools/UrlParser'
import UrlBuilder         from './pages/tools/UrlBuilder'
import HttpStatusCodes    from './pages/tools/HttpStatusCodes'
import JsonPathTester     from './pages/tools/JsonPathTester'

// Generators
import UuidGenerator      from './pages/tools/UuidGenerator'
import HashGenerator      from './pages/tools/HashGenerator'
import RandomNumber       from './pages/tools/RandomNumber'

// Math
import PercentageCalc     from './pages/tools/PercentageCalc'
import NumberBase         from './pages/tools/NumberBase'
import RomanNumeral       from './pages/tools/RomanNumeral'
import BinaryCalculator   from './pages/tools/BinaryCalculator'
import PrimeChecker       from './pages/tools/PrimeChecker'
import GcdLcm             from './pages/tools/GcdLcm'
import FibonacciGenerator from './pages/tools/FibonacciGenerator'
import BmiCalculator      from './pages/tools/BmiCalculator'
import TipCalculator      from './pages/tools/TipCalculator'
import LoanCalculator     from './pages/tools/LoanCalculator'
import CompoundInterest   from './pages/tools/CompoundInterest'
import VatCalculator      from './pages/tools/VatCalculator'

// Time & Date
import AgeCalculator      from './pages/tools/AgeCalculator'
import DateDifference     from './pages/tools/DateDifference'
import TimeZoneConverter  from './pages/tools/TimeZoneConverter'
import CountdownTimer     from './pages/tools/CountdownTimer'
import Stopwatch          from './pages/tools/Stopwatch'
import WorkingDays        from './pages/tools/WorkingDays'
import WeekNumber         from './pages/tools/WeekNumber'
import PomodoroTimer      from './pages/tools/PomodoroTimer'

// Images & Files
import ImageResizer       from './pages/tools/ImageResizer'
import FileSizeConverter  from './pages/tools/FileSizeConverter'
import ImageToBase64      from './pages/tools/ImageToBase64'
import Base64ToImage      from './pages/tools/Base64ToImage'
import ImageColorPicker   from './pages/tools/ImageColorPicker'
import FaviconGenerator   from './pages/tools/FaviconGenerator'

// Design / CSS
import GradientGenerator     from './pages/tools/GradientGenerator'
import BoxShadowGenerator    from './pages/tools/BoxShadowGenerator'
import BorderRadiusGenerator from './pages/tools/BorderRadiusGenerator'
import PaletteGenerator      from './pages/tools/PaletteGenerator'
import FlexboxPlayground     from './pages/tools/FlexboxPlayground'
import GridGenerator         from './pages/tools/GridGenerator'
import SvgOptimizer          from './pages/tools/SvgOptimizer'
import HtmlColorNames        from './pages/tools/HtmlColorNames'

// Developer extras
import HexCalculator         from './pages/tools/HexCalculator'
import IbanValidator         from './pages/tools/IbanValidator'
import CreditCardValidator   from './pages/tools/CreditCardValidator'
import DataUriEncoder        from './pages/tools/DataUriEncoder'
import TotpGenerator         from './pages/tools/TotpGenerator'
import FakeDataGenerator     from './pages/tools/FakeDataGenerator'

// Text extras
import LineBreakRemover      from './pages/tools/LineBreakRemover'
import SentenceCounter       from './pages/tools/SentenceCounter'
import TextToHashtags        from './pages/tools/TextToHashtags'
import TitleCaseApa          from './pages/tools/TitleCaseApa'
import PigLatin              from './pages/tools/PigLatin'

// Math extras
import ScientificCalculator  from './pages/tools/ScientificCalculator'
import FactorialCalculator   from './pages/tools/FactorialCalculator'

// Generators extras
import AvatarGenerator       from './pages/tools/AvatarGenerator'
import LogoMaker             from './pages/tools/LogoMaker'

// Images & Files extras
import ExifViewer            from './pages/tools/ExifViewer'
import ImageCompressor       from './pages/tools/ImageCompressor'

// Converters & Audio
import TextToSpeech          from './pages/tools/TextToSpeech'
import CurrencyConverter     from './pages/tools/CurrencyConverter'

// Digital Signature
import DigitalSignature      from './pages/tools/DigitalSignature'

// New tools
import MetaTagGenerator      from './pages/tools/MetaTagGenerator'
import OgPreview             from './pages/tools/OgPreview'
import RobotsTxtGenerator    from './pages/tools/RobotsTxtGenerator'
import SitemapGenerator      from './pages/tools/SitemapGenerator'
import ReadabilityScore      from './pages/tools/ReadabilityScore'
import UnicodeCharMap        from './pages/tools/UnicodeCharMap'
import JsonDiff              from './pages/tools/JsonDiff'
import JwtEncoder            from './pages/tools/JwtEncoder'
import SslDecoder            from './pages/tools/SslDecoder'
import TweetThreadFormatter  from './pages/tools/TweetThreadFormatter'
import TypingSpeedTest       from './pages/tools/TypingSpeedTest'
import DnsLookup             from './pages/tools/DnsLookup'
import AsciiArtGenerator     from './pages/tools/AsciiArtGenerator'
import ColorBlindnessSimulator from './pages/tools/ColorBlindnessSimulator'
import ResumeWordChecker     from './pages/tools/ResumeWordChecker'
import BioGenerator          from './pages/tools/BioGenerator'
import KeyboardShortcuts     from './pages/tools/KeyboardShortcuts'
import JsonSchemaValidator   from './pages/tools/JsonSchemaValidator'

// New coming-soon tools
import JsFormatter            from './pages/tools/JsFormatter'
import HtmlFormatter          from './pages/tools/HtmlFormatter'
import SqlMinifier            from './pages/tools/SqlMinifier'
import GraphqlFormatter       from './pages/tools/GraphqlFormatter'
import RegexToEnglish         from './pages/tools/RegexToEnglish'
import GlobTester             from './pages/tools/GlobTester'
import QueryStringParser      from './pages/tools/QueryStringParser'
import MimeLookup             from './pages/tools/MimeLookup'
import IpInfo                 from './pages/tools/IpInfo'
import UserAgentParser        from './pages/tools/UserAgentParser'
import KebabCamel             from './pages/tools/KebabCamel'
import VowelCounter           from './pages/tools/VowelCounter'
import EmptyLineRemover       from './pages/tools/EmptyLineRemover'
import RsaGenerator           from './pages/tools/RsaGenerator'
import IsbnValidator          from './pages/tools/IsbnValidator'
import EanBarcode             from './pages/tools/EanBarcode'
import ImageCropper           from './pages/tools/ImageCropper'
import PngToJpeg              from './pages/tools/PngToJpeg'
import WebpConverter          from './pages/tools/WebpConverter'
import MatrixCalculator       from './pages/tools/MatrixCalculator'
import CalendarGenerator      from './pages/tools/CalendarGenerator'
import CssVariables           from './pages/tools/CssVariables'
import CssToTailwind          from './pages/tools/CssToTailwind'
import TomlToJson             from './pages/tools/TomlToJson'
import BcryptTool             from './pages/tools/BcryptTool'
import DocxWordCount          from './pages/tools/DocxWordCount'

// AI Tools
import AiModelComparison     from './pages/tools/AiModelComparison'
import TokenCounter          from './pages/tools/TokenCounter'
import SystemPromptBuilder   from './pages/tools/SystemPromptBuilder'
import PromptFormatter       from './pages/tools/PromptFormatter'
import PromptImprover        from './pages/tools/PromptImprover'
import LinkedInPostMaker     from './pages/tools/LinkedInPostMaker'

import InvoiceMaker from './pages/tools/InvoiceMaker'
import PdfPageCount from './pages/tools/PdfPageCount'
import PdfToText    from './pages/tools/PdfToText'
import PdfMerge     from './pages/tools/PdfMerge'

// 20 new tools (batch 1)
import TextSplitter          from './pages/tools/TextSplitter'
import CharacterRemover      from './pages/tools/CharacterRemover'
import PrefixSuffixAdder     from './pages/tools/PrefixSuffixAdder'
import FindReplace           from './pages/tools/FindReplace'
import RepeatedWordsFinder   from './pages/tools/RepeatedWordsFinder'
import TextJoiner            from './pages/tools/TextJoiner'
import TruncateText          from './pages/tools/TruncateText'
import EmojiRemover          from './pages/tools/EmojiRemover'
import NumberToWords         from './pages/tools/NumberToWords'
import DiscountCalculator    from './pages/tools/DiscountCalculator'
import RandomPicker          from './pages/tools/RandomPicker'
import NumberSorter          from './pages/tools/NumberSorter'
import PrivacyPolicyGenerator from './pages/tools/PrivacyPolicyGenerator'
import WorldClock            from './pages/tools/WorldClock'
import SimpleNote            from './pages/tools/SimpleNote'
import AlternatingCase       from './pages/tools/AlternatingCase'
import TextPadder            from './pages/tools/TextPadder'
import SequenceGenerator     from './pages/tools/SequenceGenerator'
import FlipRotateImage       from './pages/tools/FlipRotateImage'
import ToneGenerator         from './pages/tools/ToneGenerator'

// Static pages
// 21 new tools (batch 2)
import CharacterCounter    from './pages/tools/CharacterCounter'
import LineCounter         from './pages/tools/LineCounter'
import TabsToSpaces        from './pages/tools/TabsToSpaces'
import CommaSeparator      from './pages/tools/CommaSeparator'
import TextToOneLine       from './pages/tools/TextToOneLine'
import SpecialCharRemover  from './pages/tools/SpecialCharRemover'
import RegexReplacer       from './pages/tools/RegexReplacer'
import WrapText            from './pages/tools/WrapText'
import SalesTaxCalculator  from './pages/tools/SalesTaxCalculator'
import MarginCalculator    from './pages/tools/MarginCalculator'
import GstCalculator       from './pages/tools/GstCalculator'
import AreaCalculator      from './pages/tools/AreaCalculator'
import SleepCalculator     from './pages/tools/SleepCalculator'
import ShoeSizeConverter   from './pages/tools/ShoeSizeConverter'
import UtmBuilder          from './pages/tools/UtmBuilder'
import ListToArray         from './pages/tools/ListToArray'
import PortChecker         from './pages/tools/PortChecker'
import TermsGenerator      from './pages/tools/TermsGenerator'
import DisclaimerGenerator from './pages/tools/DisclaimerGenerator'
import SubtitleConverter   from './pages/tools/SubtitleConverter'
import PrimeFactorization  from './pages/tools/PrimeFactorization'

// 10 new tools (batch 3)
import UnicodeTextConverter  from './pages/tools/UnicodeTextConverter'
import ZalgoText             from './pages/tools/ZalgoText'
import CensorText            from './pages/tools/CensorText'
import Metronome             from './pages/tools/Metronome'
import ProbabilityCalculator from './pages/tools/ProbabilityCalculator'
import PayPalFeeCalculator   from './pages/tools/PayPalFeeCalculator'
import CpmCalculator         from './pages/tools/CpmCalculator'
import JsonKeySorter         from './pages/tools/JsonKeySorter'
import JsonUnescape          from './pages/tools/JsonUnescape'
import IndentText            from './pages/tools/IndentText'

// 10 new tools (batch 4)
import RandomSentenceGenerator from './pages/tools/RandomSentenceGenerator'
import WordRandomizer        from './pages/tools/WordRandomizer'
import TextAlign             from './pages/tools/TextAlign'
import ConfidenceInterval    from './pages/tools/ConfidenceInterval'
import SchemaMarkupGenerator from './pages/tools/SchemaMarkupGenerator'
import JsonToPhp             from './pages/tools/JsonToPhp'
import TableConverter        from './pages/tools/TableConverter'
import PwaManifestGenerator  from './pages/tools/PwaManifestGenerator'
import SyntaxHighlighter     from './pages/tools/SyntaxHighlighter'

// 6 new tools (batch 5)
import CsvToColumn       from './pages/tools/CsvToColumn'
import WordDuplicator    from './pages/tools/WordDuplicator'
import EmptyRowRemover   from './pages/tools/EmptyRowRemover'
import LeaseCalculator   from './pages/tools/LeaseCalculator'
import GrepTool          from './pages/tools/GrepTool'
import PresentValue      from './pages/tools/PresentValue'

// 6 new tools (batch 6)
import TextSymbolsPicker      from './pages/tools/TextSymbolsPicker'
import WordRemover            from './pages/tools/WordRemover'
import PixelateImage          from './pages/tools/PixelateImage'
import RetirementCalculator   from './pages/tools/RetirementCalculator'
import CssAnimationGenerator  from './pages/tools/CssAnimationGenerator'
import PythonFormatter        from './pages/tools/PythonFormatter'

// Static pages
import Privacy  from './pages/Privacy'
import About    from './pages/About'
import Suggest  from './pages/Suggest'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        {/* Original 8 */}
        <Route path="tools/word-counter"       element={<WordCounter />} />
        <Route path="tools/case-converter"     element={<CaseConverter />} />
        <Route path="tools/json-formatter"     element={<JsonFormatter />} />
        <Route path="tools/diff-checker"       element={<DiffChecker />} />
        <Route path="tools/qr-generator"       element={<QrGenerator />} />
        <Route path="tools/password-generator" element={<PasswordGenerator />} />
        <Route path="tools/unit-converter"     element={<UnitConverter />} />
        <Route path="tools/base64"             element={<Base64Tool />} />

        {/* Text */}
        <Route path="tools/lorem-ipsum"        element={<LoremIpsum />} />
        <Route path="tools/text-repeater"      element={<TextRepeater />} />
        <Route path="tools/string-reverse"     element={<StringReverse />} />
        <Route path="tools/duplicate-remover"  element={<DuplicateRemover />} />
        <Route path="tools/line-sort"          element={<LineSort />} />
        <Route path="tools/markdown-preview"   element={<MarkdownPreview />} />
        <Route path="tools/slug-generator"     element={<SlugGenerator />} />
        <Route path="tools/word-frequency"     element={<WordFrequency />} />
        <Route path="tools/text-to-binary"     element={<TextToBinary />} />
        <Route path="tools/morse-code"         element={<MorseCode />} />
        <Route path="tools/palindrome"         element={<PalindromeChecker />} />
        <Route path="tools/anagram"            element={<AnagramChecker />} />
        <Route path="tools/whitespace-remover" element={<WhitespaceRemover />} />
        <Route path="tools/email-extractor"    element={<EmailExtractor />} />
        <Route path="tools/url-extractor"      element={<UrlExtractor />} />
        <Route path="tools/number-extractor"   element={<NumberExtractor />} />

        {/* Developer */}
        <Route path="tools/html-entities"      element={<HtmlEntities />} />
        <Route path="tools/jwt-decoder"        element={<JwtDecoder />} />
        <Route path="tools/regex-tester"       element={<RegexTester />} />
        <Route path="tools/color-converter"    element={<ColorConverter />} />
        <Route path="tools/timestamp"          element={<TimestampConverter />} />
        <Route path="tools/css-minifier"       element={<CssMinifier />} />
        <Route path="tools/css-formatter"      element={<CssFormatter />} />
        <Route path="tools/js-minifier"        element={<JsMinifier />} />
        <Route path="tools/html-minifier"      element={<HtmlMinifier />} />
        <Route path="tools/html-to-markdown"   element={<HtmlToMarkdown />} />
        <Route path="tools/markdown-to-html"   element={<MarkdownToHtml />} />
        <Route path="tools/xml-formatter"      element={<XmlFormatter />} />
        <Route path="tools/xml-to-json"        element={<XmlToJson />} />
        <Route path="tools/json-to-xml"        element={<JsonToXml />} />
        <Route path="tools/json-to-csv"        element={<JsonToCsv />} />
        <Route path="tools/csv-to-json"        element={<CsvToJson />} />
        <Route path="tools/yaml-to-json"       element={<YamlToJson />} />
        <Route path="tools/json-to-yaml"       element={<JsonToYaml />} />
        <Route path="tools/sql-formatter"      element={<SqlFormatter />} />
        <Route path="tools/cron-parser"        element={<CronParser />} />
        <Route path="tools/url-parser"         element={<UrlParser />} />
        <Route path="tools/url-builder"        element={<UrlBuilder />} />
        <Route path="tools/http-status"        element={<HttpStatusCodes />} />
        <Route path="tools/json-path"          element={<JsonPathTester />} />

        {/* Generators */}
        <Route path="tools/uuid-generator"     element={<UuidGenerator />} />
        <Route path="tools/hash-generator"     element={<HashGenerator />} />
        <Route path="tools/random-number"      element={<RandomNumber />} />

        {/* Math */}
        <Route path="tools/percentage"         element={<PercentageCalc />} />
        <Route path="tools/number-base"        element={<NumberBase />} />
        <Route path="tools/roman-numeral"      element={<RomanNumeral />} />
        <Route path="tools/binary-calculator"  element={<BinaryCalculator />} />
        <Route path="tools/prime-checker"      element={<PrimeChecker />} />
        <Route path="tools/gcd-lcm"            element={<GcdLcm />} />
        <Route path="tools/fibonacci"          element={<FibonacciGenerator />} />
        <Route path="tools/bmi"               element={<BmiCalculator />} />
        <Route path="tools/tip-calculator"     element={<TipCalculator />} />
        <Route path="tools/loan-calculator"    element={<LoanCalculator />} />
        <Route path="tools/compound-interest"  element={<CompoundInterest />} />
        <Route path="tools/vat-calculator"     element={<VatCalculator />} />

        {/* Time & Date */}
        <Route path="tools/age-calculator"     element={<AgeCalculator />} />
        <Route path="tools/date-difference"    element={<DateDifference />} />
        <Route path="tools/timezone"           element={<TimeZoneConverter />} />
        <Route path="tools/countdown"          element={<CountdownTimer />} />
        <Route path="tools/stopwatch"          element={<Stopwatch />} />
        <Route path="tools/working-days"       element={<WorkingDays />} />
        <Route path="tools/week-number"        element={<WeekNumber />} />
        <Route path="tools/pomodoro"           element={<PomodoroTimer />} />

        {/* Images & Files */}
        <Route path="tools/image-resizer"      element={<ImageResizer />} />
        <Route path="tools/file-size"          element={<FileSizeConverter />} />
        <Route path="tools/image-to-base64"    element={<ImageToBase64 />} />
        <Route path="tools/base64-to-image"    element={<Base64ToImage />} />
        <Route path="tools/image-color-picker" element={<ImageColorPicker />} />
        <Route path="tools/favicon-generator"  element={<FaviconGenerator />} />

        {/* Design / CSS */}
        <Route path="tools/gradient-generator"      element={<GradientGenerator />} />
        <Route path="tools/box-shadow"               element={<BoxShadowGenerator />} />
        <Route path="tools/border-radius"            element={<BorderRadiusGenerator />} />
        <Route path="tools/palette-generator"        element={<PaletteGenerator />} />
        <Route path="tools/flexbox-playground"       element={<FlexboxPlayground />} />
        <Route path="tools/grid-generator"           element={<GridGenerator />} />
        <Route path="tools/svg-optimizer"            element={<SvgOptimizer />} />
        <Route path="tools/html-color-names"         element={<HtmlColorNames />} />

        {/* Developer extras */}
        <Route path="tools/hex-calculator"           element={<HexCalculator />} />
        <Route path="tools/iban-validator"           element={<IbanValidator />} />
        <Route path="tools/credit-card-validator"    element={<CreditCardValidator />} />
        <Route path="tools/data-uri-encoder"         element={<DataUriEncoder />} />
        <Route path="tools/totp-generator"           element={<TotpGenerator />} />
        <Route path="tools/fake-data-generator"      element={<FakeDataGenerator />} />

        {/* Text extras */}
        <Route path="tools/line-break-remover"       element={<LineBreakRemover />} />
        <Route path="tools/sentence-counter"         element={<SentenceCounter />} />
        <Route path="tools/text-to-hashtags"         element={<TextToHashtags />} />
        <Route path="tools/title-case-apa"           element={<TitleCaseApa />} />
        <Route path="tools/pig-latin"                element={<PigLatin />} />

        {/* Math extras */}
        <Route path="tools/scientific-calculator"    element={<ScientificCalculator />} />
        <Route path="tools/factorial"                element={<FactorialCalculator />} />

        {/* Generators extras */}
        <Route path="tools/avatar-generator"         element={<AvatarGenerator />} />
        <Route path="tools/logo-maker"               element={<LogoMaker />} />

        {/* Images & Files extras */}
        <Route path="tools/exif-viewer"              element={<ExifViewer />} />
        <Route path="tools/image-compressor"         element={<ImageCompressor />} />

        {/* Converters & Audio */}
        <Route path="tools/text-to-speech"           element={<TextToSpeech />} />
        <Route path="tools/currency-converter"       element={<CurrencyConverter />} />

        {/* Digital Signature */}
        <Route path="tools/digital-signature"        element={<DigitalSignature />} />

        {/* New tools */}
        <Route path="tools/meta-tag-generator"       element={<MetaTagGenerator />} />
        <Route path="tools/og-preview"               element={<OgPreview />} />
        <Route path="tools/robots-txt"               element={<RobotsTxtGenerator />} />
        <Route path="tools/sitemap-generator"        element={<SitemapGenerator />} />
        <Route path="tools/readability-score"        element={<ReadabilityScore />} />
        <Route path="tools/unicode-char-map"         element={<UnicodeCharMap />} />
        <Route path="tools/json-diff"                element={<JsonDiff />} />
        <Route path="tools/jwt-encoder"              element={<JwtEncoder />} />
        <Route path="tools/ssl-decoder"              element={<SslDecoder />} />
        <Route path="tools/tweet-thread"             element={<TweetThreadFormatter />} />
        <Route path="tools/typing-speed"             element={<TypingSpeedTest />} />
        <Route path="tools/dns-lookup"               element={<DnsLookup />} />
        <Route path="tools/ascii-art"                element={<AsciiArtGenerator />} />
        <Route path="tools/color-blindness"          element={<ColorBlindnessSimulator />} />
        <Route path="tools/resume-word-checker"      element={<ResumeWordChecker />} />
        <Route path="tools/bio-generator"            element={<BioGenerator />} />
        <Route path="tools/keyboard-shortcuts"       element={<KeyboardShortcuts />} />
        <Route path="tools/json-schema-validator"    element={<JsonSchemaValidator />} />

        {/* AI Tools */}
        <Route path="tools/ai-model-comparison"      element={<AiModelComparison />} />
        <Route path="tools/token-counter"            element={<TokenCounter />} />
        <Route path="tools/system-prompt-builder"    element={<SystemPromptBuilder />} />
        <Route path="tools/prompt-formatter"         element={<PromptFormatter />} />
        <Route path="tools/prompt-improver"          element={<PromptImprover />} />
        <Route path="tools/linkedin-post-maker"      element={<LinkedInPostMaker />} />

        {/* New tools */}
        <Route path="tools/js-formatter"               element={<JsFormatter />} />
        <Route path="tools/html-formatter"             element={<HtmlFormatter />} />
        <Route path="tools/sql-minifier"               element={<SqlMinifier />} />
        <Route path="tools/graphql-formatter"          element={<GraphqlFormatter />} />
        <Route path="tools/regex-to-english"           element={<RegexToEnglish />} />
        <Route path="tools/glob-tester"                element={<GlobTester />} />
        <Route path="tools/query-string"               element={<QueryStringParser />} />
        <Route path="tools/mime-lookup"                element={<MimeLookup />} />
        <Route path="tools/ip-info"                    element={<IpInfo />} />
        <Route path="tools/user-agent"                 element={<UserAgentParser />} />
        <Route path="tools/kebab-camel"                element={<KebabCamel />} />
        <Route path="tools/vowel-counter"              element={<VowelCounter />} />
        <Route path="tools/empty-line-remover"         element={<EmptyLineRemover />} />
        <Route path="tools/rsa-generator"              element={<RsaGenerator />} />
        <Route path="tools/isbn-validator"             element={<IsbnValidator />} />
        <Route path="tools/ean-barcode"                element={<EanBarcode />} />
        <Route path="tools/image-cropper"              element={<ImageCropper />} />
        <Route path="tools/png-to-jpeg"                element={<PngToJpeg />} />
        <Route path="tools/webp-converter"             element={<WebpConverter />} />
        <Route path="tools/matrix-calculator"          element={<MatrixCalculator />} />
        <Route path="tools/calendar"                   element={<CalendarGenerator />} />
        <Route path="tools/css-variables"              element={<CssVariables />} />
        <Route path="tools/css-to-tailwind"            element={<CssToTailwind />} />
        <Route path="tools/toml-to-json"               element={<TomlToJson />} />
        <Route path="tools/bcrypt"                     element={<BcryptTool />} />
        <Route path="tools/docx-word-count"            element={<DocxWordCount />} />
        <Route path="tools/invoice-maker"              element={<InvoiceMaker />} />
        <Route path="tools/pdf-page-count"             element={<PdfPageCount />} />
        <Route path="tools/pdf-to-text"                element={<PdfToText />} />
        <Route path="tools/pdf-merge"                  element={<PdfMerge />} />

        {/* 20 new tools (batch 1) */}
        <Route path="tools/text-splitter"              element={<TextSplitter />} />
        <Route path="tools/character-remover"          element={<CharacterRemover />} />
        <Route path="tools/prefix-suffix"              element={<PrefixSuffixAdder />} />
        <Route path="tools/find-replace"               element={<FindReplace />} />
        <Route path="tools/repeated-words"             element={<RepeatedWordsFinder />} />
        <Route path="tools/text-joiner"                element={<TextJoiner />} />
        <Route path="tools/truncate-text"              element={<TruncateText />} />
        <Route path="tools/emoji-remover"              element={<EmojiRemover />} />
        <Route path="tools/number-to-words"            element={<NumberToWords />} />
        <Route path="tools/discount-calculator"        element={<DiscountCalculator />} />
        <Route path="tools/random-picker"              element={<RandomPicker />} />
        <Route path="tools/number-sorter"              element={<NumberSorter />} />
        <Route path="tools/privacy-policy-generator"   element={<PrivacyPolicyGenerator />} />
        <Route path="tools/world-clock"                element={<WorldClock />} />
        <Route path="tools/simple-note"                element={<SimpleNote />} />
        <Route path="tools/alternating-case"           element={<AlternatingCase />} />
        <Route path="tools/text-padder"                element={<TextPadder />} />
        <Route path="tools/sequence-generator"         element={<SequenceGenerator />} />
        <Route path="tools/flip-rotate-image"          element={<FlipRotateImage />} />
        <Route path="tools/tone-generator"             element={<ToneGenerator />} />

  {/* 21 new tools (batch 2) */}
        <Route path="tools/character-counter"          element={<CharacterCounter />} />
        <Route path="tools/line-counter"               element={<LineCounter />} />
        <Route path="tools/tabs-to-spaces"             element={<TabsToSpaces />} />
        <Route path="tools/comma-separator"            element={<CommaSeparator />} />
        <Route path="tools/text-to-one-line"           element={<TextToOneLine />} />
        <Route path="tools/special-char-remover"       element={<SpecialCharRemover />} />
        <Route path="tools/regex-replacer"             element={<RegexReplacer />} />
        <Route path="tools/wrap-text"                  element={<WrapText />} />
        <Route path="tools/sales-tax"                  element={<SalesTaxCalculator />} />
        <Route path="tools/margin-calculator"          element={<MarginCalculator />} />
        <Route path="tools/gst-calculator"             element={<GstCalculator />} />
        <Route path="tools/area-calculator"            element={<AreaCalculator />} />
        <Route path="tools/sleep-calculator"           element={<SleepCalculator />} />
        <Route path="tools/shoe-size"                  element={<ShoeSizeConverter />} />
        <Route path="tools/utm-builder"                element={<UtmBuilder />} />
        <Route path="tools/list-to-array"              element={<ListToArray />} />
        <Route path="tools/port-checker"               element={<PortChecker />} />
        <Route path="tools/terms-generator"            element={<TermsGenerator />} />
        <Route path="tools/disclaimer-generator"       element={<DisclaimerGenerator />} />
        <Route path="tools/subtitle-converter"         element={<SubtitleConverter />} />
        <Route path="tools/prime-factorization"        element={<PrimeFactorization />} />

        {/* 10 new tools (batch 3) */}
        <Route path="tools/unicode-text-converter"  element={<UnicodeTextConverter />} />
        <Route path="tools/zalgo-text"              element={<ZalgoText />} />
        <Route path="tools/censor-text"             element={<CensorText />} />
        <Route path="tools/metronome"               element={<Metronome />} />
        <Route path="tools/probability"             element={<ProbabilityCalculator />} />
        <Route path="tools/paypal-fee"              element={<PayPalFeeCalculator />} />
        <Route path="tools/cpm-calculator"          element={<CpmCalculator />} />
        <Route path="tools/json-key-sorter"         element={<JsonKeySorter />} />
        <Route path="tools/json-unescape"           element={<JsonUnescape />} />
        <Route path="tools/indent-text"              element={<IndentText />} />

        {/* 10 new tools (batch 4) */}
        <Route path="tools/random-sentence"         element={<RandomSentenceGenerator />} />
        <Route path="tools/word-randomizer"         element={<WordRandomizer />} />
        <Route path="tools/text-align"              element={<TextAlign />} />
        <Route path="tools/confidence-interval"     element={<ConfidenceInterval />} />
        <Route path="tools/schema-markup"           element={<SchemaMarkupGenerator />} />
        <Route path="tools/json-to-php"             element={<JsonToPhp />} />
        <Route path="tools/table-converter"         element={<TableConverter />} />
        <Route path="tools/pwa-manifest"            element={<PwaManifestGenerator />} />
        <Route path="tools/syntax-highlighter"      element={<SyntaxHighlighter />} />

        {/* 6 new tools (batch 5) */}
        <Route path="tools/csv-to-column"           element={<CsvToColumn />} />
        <Route path="tools/word-duplicator"         element={<WordDuplicator />} />
        <Route path="tools/empty-row-remover"       element={<EmptyRowRemover />} />
        <Route path="tools/lease-calculator"        element={<LeaseCalculator />} />
        <Route path="tools/grep"                    element={<GrepTool />} />
        <Route path="tools/present-value"           element={<PresentValue />} />

        {/* 6 new tools (batch 6) */}
        <Route path="tools/text-symbols"            element={<TextSymbolsPicker />} />
        <Route path="tools/word-remover"            element={<WordRemover />} />
        <Route path="tools/pixelate-image"          element={<PixelateImage />} />
        <Route path="tools/retirement-calculator"   element={<RetirementCalculator />} />
        <Route path="tools/css-animation"           element={<CssAnimationGenerator />} />
        <Route path="tools/python-formatter"        element={<PythonFormatter />} />

        {/* Static */}
        <Route path="privacy" element={<Privacy />} />
        <Route path="about"   element={<About />} />
        <Route path="suggest" element={<Suggest />} />
        <Route path="contact" element={<Suggest />} />
        <Route path="*"       element={<NotFound />} />
      </Route>
    </Routes>
  )
}
