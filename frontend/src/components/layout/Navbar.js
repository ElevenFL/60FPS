import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src="https://sdmntpreastus.oaiusercontent.com/files/00000000-3864-61f9-8d2a-b0cdbac6b231/raw?se=2025-06-11T06%3A44%3A45Z&sp=r&sv=2024-08-04&sr=b&scid=b7e5945d-9da3-5587-84ce-803dddeda15a&skoid=31bc9c1a-c7e0-460a-8671-bf4a3c419305&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-10T11%3A46%3A23Z&ske=2025-06-11T11%3A46%3A23Z&sks=b&skv=2024-08-04&sig=uA/oWvTPxT%2BPH/kMpBud55%2BOHrjFHy98123wSLlNQpg%3D" alt="Logo" className="logo" />
                <Link to="/">60FPS</Link>
            </div>

            <div className="navbar-menu">
                <Link to="/games">Videojuegos</Link>
                {user ? (
                    <>
                        <Link to="/games/add" className="add-game-link">
                            Agregar Videojuego
                        </Link>
                        <Link to="/profile">Mi Perfil</Link>
                        <button onClick={handleLogout}>Cerrar Sesión</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Iniciar Sesión</Link>
                        <Link to="/register">Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 