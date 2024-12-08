import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Berita from "./Berita";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Berita />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
