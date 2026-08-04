import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import WordCounter from './pages/tools/WordCounter'
import CaseConverter from './pages/tools/CaseConverter'
import JsonFormatter from './pages/tools/JsonFormatter'
import DiffChecker from './pages/tools/DiffChecker'
import QrGenerator from './pages/tools/QrGenerator'
import PasswordGenerator from './pages/tools/PasswordGenerator'
import UnitConverter from './pages/tools/UnitConverter'
import Base64Tool from './pages/tools/Base64Tool'
import Privacy from './pages/Privacy'
import About from './pages/About'
import Suggest from './pages/Suggest'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tools/word-counter" element={<WordCounter />} />
        <Route path="tools/case-converter" element={<CaseConverter />} />
        <Route path="tools/json-formatter" element={<JsonFormatter />} />
        <Route path="tools/diff-checker" element={<DiffChecker />} />
        <Route path="tools/qr-generator" element={<QrGenerator />} />
        <Route path="tools/password-generator" element={<PasswordGenerator />} />
        <Route path="tools/unit-converter" element={<UnitConverter />} />
        <Route path="tools/base64" element={<Base64Tool />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="about" element={<About />} />
        <Route path="suggest" element={<Suggest />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
