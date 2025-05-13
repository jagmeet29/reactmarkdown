import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // Get user's location when component mounts
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
            );
            const data = await response.json();
            setUserLocation(`${data.city}, ${data.countryName}`);
          } catch (err) {
            console.error("Error getting location details:", err);
            setUserLocation("Location not available");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation("Location access denied");
        }
      );
    } else {
      setUserLocation("Geolocation not supported");
    }
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // For development only: bypass actual API call
      // In production, you would use the fetch call to a real server
      console.log('Development mode: Using mock login');
      
      // Simulate successful login
      const mockUser = { 
        id: "1", 
        email: email,
        username: email.split('@')[0],
        location: userLocation
      };
      
      login(mockUser);
      const from = location.state?.from?.pathname || '/topics';
      navigate(from, { replace: true });
      
      // Uncomment below for real API implementation
      /*
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, location: userLocation }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.user);
        const from = location.state?.from?.pathname || '/topics';
        navigate(from, { replace: true });
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid email or password');
      }
      */
    } catch (err) {
      setError('Error during login: ' + err.message);
    }
  };

  return (
    <div className=" auth-container">
      <h1 style={{marginTop:`30px`}}>Login</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default LoginPage;
