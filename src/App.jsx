import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

// Original 8
import WordCounter      from './pages/tools/WordCounter'
import CaseConverter    from './pages/tools/CaseConverter'
import JsonFormatter    from './pages/tools/JsonFormatter'
import DiffChecker      from './pages/tools/DiffChecker'
import QrGenerator      from './pages/tools/QrGenerator'
import PasswordGenerator from './pages/tools/PasswordGenerator'
import UnitConverter    from './pages/tools/UnitConverter'
import Base64Tool       from './pages/tools/Base64Tool'

// Text
import LoremIpsum       from './pages/tools/LoremIpsum'
import TextRepeater     from './pages/tools/TextRepeater'
import StringReverse    from './pages/tools/StringReverse'
import DuplicateRemover from './pages/tools/DuplicateRemover'
import LineSort         from './pages/tools/LineSort'
import MarkdownPreview  from './pages/tools/MarkdownPreview'

// Developer
import HtmlEntities     from './pages/tools/HtmlEntities'
import JwtDecoder       from './pages/tools/JwtDecoder'
import RegexTester      from './pages/tools/RegexTester'
import ColorConverter   from './pages/tools/ColorConverter'
import TimestampConverter from './pages/tools/TimestampConverter'

// Generators
import UuidGenerator    from './pages/tools/UuidGenerator'
import HashGenerator    from './pages/tools/HashGenerator'
import RandomNumber     from './pages/tools/RandomNumber'

// Math
import PercentageCalc   from './pages/tools/PercentageCalc'
import NumberBase       from './pages/tools/NumberBase'
import RomanNumeral     from './pages/tools/RomanNumeral'

// Time & Date
import AgeCalculator    from './pages/tools/AgeCalculator'
import DateDifference   from './pages/tools/DateDifference'

// Images & Files
import ImageResizer     from './pages/tools/ImageResizer'
import FileSizeConverter from './pages/tools/FileSizeConverter'

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

        {/* Developer */}
        <Route path="tools/html-entities"      element={<HtmlEntities />} />
        <Route path="tools/jwt-decoder"        element={<JwtDecoder />} />
        <Route path="tools/regex-tester"       element={<RegexTester />} />
        <Route path="tools/color-converter"    element={<ColorConverter />} />
        <Route path="tools/timestamp"          element={<TimestampConverter />} />

        {/* Generators */}
        <Route path="tools/uuid-generator"     element={<UuidGenerator />} />
        <Route path="tools/hash-generator"     element={<HashGenerator />} />
        <Route path="tools/random-number"      element={<RandomNumber />} />

        {/* Math */}
        <Route path="tools/percentage"         element={<PercentageCalc />} />
        <Route path="tools/number-base"        element={<NumberBase />} />
        <Route path="tools/roman-numeral"      element={<RomanNumeral />} />

        {/* Time & Date */}
        <Route path="tools/age-calculator"     element={<AgeCalculator />} />
        <Route path="tools/date-difference"    element={<DateDifference />} />

        {/* Images & Files */}
        <Route path="tools/image-resizer"      element={<ImageResizer />} />
        <Route path="tools/file-size"          element={<FileSizeConverter />} />

        {/* Static */}
        <Route path="privacy" element={<Privacy />} />
        <Route path="about"   element={<About />} />
        <Route path="suggest" element={<Suggest />} />
        <Route path="*"       element={<NotFound />} />
      </Route>
    </Routes>
  )
}
