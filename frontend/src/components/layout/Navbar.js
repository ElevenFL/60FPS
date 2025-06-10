import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
                <Link to="/">60FPS</Link>
            </div>

            <div className="navbar-menu">
                <Link to="/games">Videojuegos</Link>
                {user ? (
                    <>
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