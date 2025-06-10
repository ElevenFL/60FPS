import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import GameList from './components/games/GameList';
import GameDetail from './components/games/GameDetail';
import AuthForm from './components/auth/AuthForm';
import AddGame from './components/games/AddGame';
import EditGame from './components/games/EditGame';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="container">
                    <Routes>
                        <Route path="/" element={<GameList />} />
                        <Route path="/games" element={<GameList />} />
                        <Route path="/games/:id" element={<GameDetail />} />
                        <Route path="/games/add" element={<AddGame />} />
                        <Route path="/games/:id/edit" element={<EditGame />} />
                        <Route path="/login" element={<AuthForm isLogin={true} />} />
                        <Route path="/register" element={<AuthForm isLogin={false} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
