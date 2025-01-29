import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): JSX.Element {
  return (
    <>
      <input
        style={{
          width: '200px',
          height: '200px',
          background: 'red'
        }}
      />
      This is the updated version to show input in the ota
      <h1>Heyyy This is gonna be the new version</h1>
      <img alt="logo" className="logo" src={electronLogo} />
      <Versions></Versions>
    </>
  )
}

export default App
