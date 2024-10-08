import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { username, email, password } = body;

  // Make sure credentials are received
  if (!username || !email || !password) {
    return NextResponse.json(
      { message: 'All fields are required' },
      { status: 400 }
    );
  }
  // Check connection to Database
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { message: `Couldn't reach DB, please check your key` },
      { status: 500 }
    );
  }

  // Connect to DB
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

  try {
    // Check if user already exists
    const existingUser = await sql`SELECT * FROM USERS WHERE EMAIL = ${email}`;
    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await sql`
            INSERT INTO USERS (username, email, password)
            VALUES (${username}, ${email}, ${hashedPassword})
            RETURNING id, username;
        `;

    const user = newUser[0];
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      message: 'Signup successful',
      token,
      username: user.username,
    });
  } catch (error) {
    return NextResponse.json(
      { message: `Error creating user: ${error}` },
      { status: 500 }
    );
  }
};

// users table schema
// -- Drop the existing users table
// DROP TABLE IF EXISTS users;

// -- Create the new users table with an additional session_token column
// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(50) UNIQUE NOT NULL,
//     email VARCHAR(100) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     session_token VARCHAR(64), -- New column for session token
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
