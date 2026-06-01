import { useEffect } from 'react'
import AppRouter from './router/AppRouter'
import useStore from './store/useStore'

export default function App() {
  const theme = useStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return <AppRouter />
}