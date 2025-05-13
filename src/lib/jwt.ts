import * as jose from 'jose';

// Ensure JWT_SECRET is set
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface JWTPayload extends jose.JWTPayload {
  userId: string;
  username: string;
  role: string;
}

export async function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const secret = new TextEncoder().encode(JWT_SECRET);
  
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  console.log(token, "verify token")
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined');
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    // Type guard to ensure decoded has the required properties
    const isValidPayload = (payload: any): payload is JWTPayload => {
      return typeof payload === 'object' && payload !== null &&
             typeof payload.userId === 'string' &&
             typeof payload.username === 'string' &&
             typeof payload.role === 'string';
    };
    
    if (!isValidPayload(payload)) {
      console.error('Invalid token payload structure');
      return null;
    }
    
    return payload as JWTPayload;
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      console.error('JWT verification error: Token expired');
    } else if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
      console.error('JWT verification error: Invalid signature');
    } else {
      console.error('Unexpected error during token verification:', error);
    }
    return null;
  }
}