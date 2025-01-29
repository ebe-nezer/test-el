import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): JSX.Element {
  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <Versions></Versions>
    </>
  )
}

export default App
