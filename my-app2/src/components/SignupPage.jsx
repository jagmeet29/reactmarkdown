import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get detailed location when component mounts
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Using OpenStreetMap Nominatim for more detailed reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&addressdetails=1`,
              {
                headers: {
                  'Accept-Language': 'en-US,en;q=0.9',
                  'User-Agent': 'Mozilla/5.0' // Required by Nominatim's terms
                }
              }
            );
            const data = await response.json();
            
            // Construct detailed location string
            const details = [];
            if (data.address) {
              if (data.address.road) details.push(data.address.road);
              if (data.address.suburb) details.push(data.address.suburb);
              if (data.address.city || data.address.town) details.push(data.address.city || data.address.town);
              if (data.address.state) details.push(data.address.state);
              if (data.address.country) details.push(data.address.country);
            }
            
            const detailedLocation = details.join(', ');
            setLocation(detailedLocation || 'Location not available');
            
            // Also save coordinates for precision
            if (detailedLocation) {
              setLocation(`${detailedLocation} (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`);
            }
          } catch (err) {
            console.error("Error getting location details:", err);
            setLocation("Location not available");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Location access denied");
        },
        {
          enableHighAccuracy: true, // Request high accuracy
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // For development only: bypass actual API call
      console.log('Development mode: Using mock signup');
      
      // Simulate successful signup
      alert('Signup successful! Please login.');
      navigate('/login');
      
      // Uncomment below for real API implementation
      /*
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, location }),
      });

      if (response.ok) {
        alert('Signup successful! Please login.');
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Signup failed');
      }
      */
    } catch (err) {
      setError('Error during signup: ' + err.message);
    }
  };

  return (
    <div className="container auth-container">
      <h1 style={{marginTop:`30px`}}>Sign Up</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" className="auth-button">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default SignupPage;
