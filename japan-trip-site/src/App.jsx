import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ItineraryHome from './pages/ItineraryHome'
import DestinationsIndex from './pages/DestinationsIndex'
import DestinationDetail from './pages/DestinationDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ItineraryHome />} />
          <Route path="/destinations" element={<DestinationsIndex />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
