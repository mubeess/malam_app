import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import BookListPage from './pages/Books/BookListPage';
import CreateBookPage from './pages/Books/CreateBookPage';
import EditBookPage from './pages/Books/EditBookPage';
import AudioListPage from './pages/Audio/AudioListPage';
import CreateAudioPage from './pages/Audio/CreateAudioPage';
import EditAudioPage from './pages/Audio/EditAudioPage';
import VideoListPage from './pages/Videos/VideoListPage'; // Import VideoListPage

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-start space-x-6">
          <Link to="/books" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
            Books
          </Link>
          <Link to="/audio" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
            Audio
          </Link>
          <Link to="/videos" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
            Videos
          </Link>
          {/* Add more navigation links here as needed */}
        </div>
      </nav>
      
      <div className="app-container p-4"> {/* Basic container for padding */}
        <Routes>
          {/* Book Routes */}
          <Route path="/" element={<BookListPage />} />
          <Route path="/books" element={<BookListPage />} />
          <Route path="/books/new" element={<CreateBookPage />} />
          <Route path="/books/edit/:id" element={<EditBookPage />} />
          
          {/* Audio Routes */}
          <Route path="/audio" element={<AudioListPage />} />
          <Route path="/audio/new" element={<CreateAudioPage />} />
          <Route path="/audio/edit/:id" element={<EditAudioPage />} />

          {/* Video Routes */}
          <Route path="/videos" element={<VideoListPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
