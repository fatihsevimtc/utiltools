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

// AI Tools
import AiModelComparison     from './pages/tools/AiModelComparison'
import TokenCounter          from './pages/tools/TokenCounter'
import SystemPromptBuilder   from './pages/tools/SystemPromptBuilder'
import PromptFormatter       from './pages/tools/PromptFormatter'
import PromptImprover        from './pages/tools/PromptImprover'
import LinkedInPostMaker     from './pages/tools/LinkedInPostMaker'

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

        {/* AI Tools */}
        <Route path="tools/ai-model-comparison"      element={<AiModelComparison />} />
        <Route path="tools/token-counter"            element={<TokenCounter />} />
        <Route path="tools/system-prompt-builder"    element={<SystemPromptBuilder />} />
        <Route path="tools/prompt-formatter"         element={<PromptFormatter />} />
        <Route path="tools/prompt-improver"          element={<PromptImprover />} />
        <Route path="tools/linkedin-post-maker"      element={<LinkedInPostMaker />} />

        {/* Static */}
        <Route path="privacy" element={<Privacy />} />
        <Route path="about"   element={<About />} />
        <Route path="suggest" element={<Suggest />} />
        <Route path="*"       element={<NotFound />} />
      </Route>
    </Routes>
  )
}
