import { AppRouter } from './AppRouter.tsx'
import '../app/styes/global.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'
import UserLoader from './UserLoader';

function App() {
  return (
    <>
      <UserLoader />
      <AppRouter />
    </>
  )
}

export default App
