import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { brazilPresidency } from './scenarios/brazilPresidency'
import { GameMap } from './ui/GameMap'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameMap scenario={brazilPresidency} />
  </StrictMode>,
)
