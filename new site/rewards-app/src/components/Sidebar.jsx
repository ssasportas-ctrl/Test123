import { IconHome, IconSparkle, IconBag, IconStar, IconUser } from './icons'

const TABS = [
  { key: 'home', label: 'Home', Icon: IconHome },
  { key: 'services', label: 'Services', Icon: IconSparkle },
  { key: 'shop', label: 'Shop', Icon: IconBag },
  { key: 'rewards', label: 'Rewards', Icon: IconStar },
  { key: 'me', label: 'Me', Icon: IconUser },
]

export default function Sidebar({ active, onSelect, language, onLanguage }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-title">MeritOne</div>
      <div className="sidebar-tabs">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`sidebar-row${active === key ? ' active' : ''}`}
            onClick={() => onSelect(key)}
          >
            <span className="sidebar-icon" aria-hidden="true">
              <Icon />
            </span>
            {label}
          </button>
        ))}
      </div>
      <div className="sidebar-lang">
        <button
          className={`lang-pill${language === 'EN' ? ' active' : ''}`}
          onClick={() => onLanguage('EN')}
        >
          EN
        </button>
        <span>|</span>
        <button
          className={`lang-pill${language === 'ES' ? ' active' : ''}`}
          onClick={() => onLanguage('ES')}
        >
          ES
        </button>
      </div>
    </nav>
  )
}
