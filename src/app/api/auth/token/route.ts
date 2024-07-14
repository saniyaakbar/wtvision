import { serialize } from "cookie";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const cookieName = "wtvCookie"

const MAX_AGE = 60 * 60 * 24 * 1; // days;

interface TokenPayload {
    username: string;
    password: string;
  }

const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, "jsonSecret", { expiresIn: '15m' });
  };
  
  const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, "jsonSecret", { expiresIn: '7d' });
  };

export async function POST(request: Request) {
  const body = await request.json();

  const { username, password } = body;
  if (username !== "bm" || password !== "kk") {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const secret = process.env.JWT_SECRET || "jsonSecret";

  const token = sign(
    {
      username,
    },
    secret,
    {
      expiresIn: MAX_AGE,
    }
  );

  const seralized = serialize(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

  const accessToken = generateAccessToken({ username, password });
    const refreshToken = generateRefreshToken({ username, password });

  const response = {
    message: "Authenticated!",
    access: accessToken,
    refresh: refreshToken,
    user: {
      username
    }
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Set-Cookie": seralized },
  });
}

