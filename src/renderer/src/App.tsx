import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): JSX.Element {
  return (
    <>
      <h1>Hello, Electron!</h1>
      <p>I hope you enjoy using basic-electron-react-boilerplate to build your Electron apps.</p>
      <img alt="logo" className="logo" src={electronLogo} />
      <Versions></Versions>
    </>
  )
}

export default App
