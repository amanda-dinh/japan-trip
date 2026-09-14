import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ItineraryHome from './pages/ItineraryHome'
import DestinationsIndex from './pages/DestinationsIndex'
import DestinationDetail from './pages/DestinationDetail'
import TravelReferencePage from './pages/TravelReferencePage'
import ChecklistPage from './pages/ChecklistPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ItineraryHome />} />
          <Route path="/destinations" element={<DestinationsIndex />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route path="/travel" element={<TravelReferencePage />} />
          <Route path="/checklist" element={<ChecklistPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
