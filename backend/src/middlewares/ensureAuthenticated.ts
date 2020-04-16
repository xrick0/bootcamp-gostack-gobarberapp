import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import authConfig from '../config/auth'

import AppError from '../errors/AppError'

interface TokenPayload {
  iat: number
  exp: number
  sub: string
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('Missing JWT Token.', 401)
  }

  const [, token] = authHeader.split(' ')

  const { secret } = authConfig.jwt

  try {
    const decodedToken = verify(token, secret)

    const { sub } = decodedToken as TokenPayload

    request.user = {
      id: sub,
    }

    return next()
  } catch (error) {
    throw new AppError('Invalid JWT token.', 401)
  }
}
