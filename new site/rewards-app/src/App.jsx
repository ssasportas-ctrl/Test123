import { useState } from 'react'
import './App.css'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Services from './pages/Services'
import Shop from './pages/Shop'
import Rewards from './pages/Rewards'
import Me from './pages/Me'

const PAGES = {
  home: Home,
  services: Services,
  shop: Shop,
  rewards: Rewards,
  me: Me,
}

function Shell() {
  const { session, authLoading, dataLoading, patient, activePage, setActivePage } = useApp()
  const [language, setLanguage] = useState('EN')

  if (authLoading) return <div className="loading-screen">Loading…</div>
  if (!session) return <Auth />
  if (dataLoading && !patient) return <div className="loading-screen">Loading your account…</div>

  const Page = PAGES[activePage]

  return (
    <div className="app-shell">
      <Sidebar active={activePage} onSelect={setActivePage} language={language} onLanguage={setLanguage} />
      <Page />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}

export default App
