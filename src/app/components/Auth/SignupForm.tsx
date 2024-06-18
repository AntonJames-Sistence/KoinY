import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import csrfFetch from '../../utils/csrfFetch';
import { useAuth } from './AuthContext';

interface SignupFormProps {
  toggleForm: () => void;
  onClose: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ toggleForm, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (password.length < 10 || !/[^A-Za-z0-9]/.test(password)) {
      alert('Password must be at least 10 characters long and contain at least one symbol');
      return;
    }

    try {
      const response = await csrfFetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      
      if (data.sessionToken) {
        localStorage.setItem('token', data.token);
        sessionStorage.setItem('sessionToken', data.sessionToken);
        // Log in the user
        login({ username: data.username });
        onClose();
      }
    } catch (error) {
      alert('Error signing up');
    }
  };

  return (
    <Box mx={3} component="form" onSubmit={handleSubmit} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5">Sign Up</Typography>
      <TextField
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{
          // Ensure this style has higher specificity
          '&.MuiButton-root': {
            backgroundColor: '#1976d2',
            color: '#ffffff',
          },
        }}
      >
        Sign Up
      </Button>
      <Typography variant="body2" align="center">
        Already have an account?
      </Typography>
      <Button onClick={toggleForm} variant="outlined" color="primary">
        Login
      </Button>
    </Box>
  );
};

export default SignupForm;