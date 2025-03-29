import { ApiResponseOptions } from '@nestjs/swagger';

export const REGISTRATION_RESPONSE: ApiResponseOptions =
  {
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        success: true,
        code: '2002',
        message: 'User created',
        data: {
          accessToken:
            'DGviuAtXwkNhoZJp2zVewVfh5DpMjucQVKm1dL5csisv...',
          refreshToken:
            'DGviuAtXwkNhoZJp2zVewVfh5DpMjucQVKm1dL5csisv...',
          user: {
            id: 1,
            username: 'John Doe',
            email: 'john.doe@example.com',
            role: 'BUYER',
          },
        },
      },
    },
  };

export const REGISTRATION_VALIDATION_ERROR: ApiResponseOptions =
  {
    status: 400,
    description:
      'Bad request - validation failed',
    schema: {
      example: {
        success: false,
        code: '1007',
        error_message: 'Validation Error',
        details: [
          {
            field: 'email',
            message:
              'Email must be a valid email address',
          },
        ],
        timestamp: '2024-03-21T10:00:00.000Z',
      },
    },
  };

export const REGISTRATION_CONFLICT_ERROR: ApiResponseOptions =
  {
    status: 409,
    description:
      'Conflict - email or username already exists',
    schema: {
      example: {
        success: false,
        code: '1105',
        error_message: 'Email already exists',
        details: {
          field: 'email',
          message: 'Email already exists',
        },
        timestamp: '2024-03-21T10:00:00.000Z',
      },
    },
  };

export const LOGIN_SUCCESS: ApiResponseOptions = {
  status: 200,
  description: 'User successfully logged in',
  schema: {
    example: {
      success: true,
      code: '2102',
      message: 'Successfully logged in',
      data: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          username: 'John Doe',
          email: 'john.doe@example.com',
          role: 'USER',
        },
      },
    },
  },
};

export const LOGIN_UNAUTHORIZED: ApiResponseOptions =
  {
    status: 401,
    description:
      'Unauthorized - invalid credentials',
    schema: {
      example: {
        success: false,
        code: '1301',
        error_message:
          'Invalid credentials provided',
        timestamp: '2024-03-21T10:00:00.000Z',
      },
    },
  };

export const REFRESH_TOKEN_SUCCESS: ApiResponseOptions =
  {
    status: 200,
    description: 'Token successfully refreshed',
    schema: {
      example: {
        success: true,
        code: '2103',
        message: 'Token refreshed successfully',
        data: {
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            username: 'John Doe',
            email: 'john.doe@example.com',
            role: 'USER',
          },
        },
      },
    },
  };

export const REFRESH_TOKEN_UNAUTHORIZED: ApiResponseOptions =
  {
    status: 401,
    description:
      'Unauthorized - invalid refresh token',
    schema: {
      example: {
        success: false,
        code: '1302',
        error_message: 'Invalid refresh token',
        timestamp: '2024-03-21T10:00:00.000Z',
      },
    },
  };

export const GOOGLE_LOGIN_SUCCESS: ApiResponseOptions =
  {
    status: 200,
    description:
      'Successfully logged in with Google',
    schema: {
      example: {
        success: true,
        code: '2104',
        message:
          'Successfully logged in with Google',
        data: {
          user: {
            id: 1,
            email: 'user@gmail.com',
            username: 'user123',
            picture: 'https://...',
            role: 'BUYER',
          },
          accessToken: 'eyJhbG...',
          refreshToken: 'eyJhbG...',
        },
      },
    },
  };

export const GOOGLE_LOGIN_ERROR: ApiResponseOptions =
  {
    status: 500,
    description:
      'Failed to process Google authentication',
    schema: {
      example: {
        success: false,
        code: '1406',
        error_message:
          'Failed to process Google authentication',
        timestamp: '2024-03-21T10:00:00.000Z',
      },
    },
  };
