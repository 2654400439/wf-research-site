import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import HomePage from './pages/Home'
import PapersPage from './pages/Papers'
import PaperDetailPage from './pages/PaperDetail'
import TimelinePage from './pages/Timeline'
import BookmarksPage from './pages/Bookmarks'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/papers" element={<PapersPage />} />
          <Route path="/papers/:id" element={<PaperDetailPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </HashRouter>
  </React.StrictMode>,
)

