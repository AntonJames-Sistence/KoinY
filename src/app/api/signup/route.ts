import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const generateSessionToken = () => crypto.randomBytes(32).toString('hex');

export const POST = async (req: NextRequest, res: NextResponse) => {
    const body = await req.json();
    const { username, email, password } = body;
    console.log(req.body)

    // Check for credentials
    if (!username || !email || !password) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    };
    // Check connection to Database
    if (!process.env.DATABASE_URL) {
        return NextResponse.json({ message: `Couldn't reach DB, please check your key` }, { status: 500 });
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate session token
    const sessionToken = generateSessionToken();
    // Connect to DB
    const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

    // Create user
    try {
        await sql`
            INSERT INTO users (username, email, password, session_token)
            VALUES (${username}, ${email}, ${hashedPassword}, ${sessionToken})
        `;
        return NextResponse.json({ message: 'User created successfully', sessionToken }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: `Error creating user: ${error}` }, { status: 500 });
    }
}

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
