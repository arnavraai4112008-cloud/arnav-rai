import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import AuctionPage from '@/pages/AuctionPage.jsx';
import PlayerDetailPage from '@/pages/PlayerDetailPage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import AdminPage from '@/pages/AdminPage.jsx';
import RoomsPage from '@/pages/RoomsPage.jsx';
import CreateRoomPage from '@/pages/CreateRoomPage.jsx';
import RoomLobbyPage from '@/pages/RoomLobbyPage.jsx';
import JoinRoomPage from '@/pages/JoinRoomPage.jsx';
import MultiplayerAuctionPage from '@/pages/MultiplayerAuctionPage.jsx';
import RoomLeaderboardPage from '@/pages/RoomLeaderboardPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auction" element={<AuctionPage />} />
          <Route path="/player/:id" element={<PlayerDetailPage />} />
          
          {/* Multiplayer Routes */}
          <Route path="/rooms" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
          <Route path="/create-room" element={<ProtectedRoute><CreateRoomPage /></ProtectedRoute>} />
          
          {/* Join Room Route must be before protected room lobby route */}
          <Route path="/join-room/:roomCode" element={<JoinRoomPage />} />
          
          <Route path="/room/:roomCode" element={<ProtectedRoute><RoomLobbyPage /></ProtectedRoute>} />
          <Route path="/room/:roomCode/auction" element={<ProtectedRoute><MultiplayerAuctionPage /></ProtectedRoute>} />
          <Route path="/room/:roomCode/leaderboard" element={<ProtectedRoute><RoomLeaderboardPage /></ProtectedRoute>} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                  <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
                  <a href="/" className="text-primary hover:underline">Back to Home</a>
                </div>
              </div>
            }
          />
        </Routes>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </Router>
  );
}

export default App;
