import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { ArticlesIndex } from './pages/ArticlesIndex'
import { ArticlePage } from './pages/ArticlePage'
import './index.css'

// lazy — แยก firebase ออกจาก bundle หลัก โหลดเฉพาะตอนเข้า /tnrpdfstudio
const PdfStudioPage = lazy(() =>
  import('./pages/PdfStudioPage').then((m) => ({ default: m.PdfStudioPage }))
)

// lazy — landing บริการรับทำผังแบ่งแปลงที่ดิน
const SubdivisionPlanPage = lazy(() =>
  import('./pages/SubdivisionPlanPage').then((m) => ({ default: m.SubdivisionPlanPage }))
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/articles" element={<ArticlesIndex />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route
          path="/tnrpdfstudio"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0d1520' }} />}>
              <PdfStudioPage />
            </Suspense>
          }
        />
        <Route
          path="/subdivisionplan"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0d1520' }} />}>
              <SubdivisionPlanPage />
            </Suspense>
          }
        />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
