import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// React 앱의 진입점.
// #root DOM 노드에 App 컴포넌트를 마운트한다.
// StrictMode는 개발 중 잠재적인 부작용을 더 빨리 발견하도록 도와준다.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
