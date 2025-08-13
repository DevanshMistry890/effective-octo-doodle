import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Game1 from './components/games/Game1';
import Game2 from './components/games/Game2';
import Game3 from './components/games/Game3';
import Game4 from './components/games/Game4';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/game1" element={
                <ProtectedRoute>
                  <Game1 />
                </ProtectedRoute>
              } />
              <Route path="/game2" element={
                <ProtectedRoute>
                  <Game2 />
                </ProtectedRoute>
              } />
              <Route path="/game3" element={
                <ProtectedRoute>
                  <Game3 />
                </ProtectedRoute>
              } />
              <Route path="/game4" element={
                <ProtectedRoute>
                  <Game4 />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
