/// <reference types="vite/client" />

export interface CheckRequest {
  flightNumber: string;
  date: string;
}

export interface CheckResponse {
  exists: boolean;
}

export interface GenerateRequest {
  name: string;
  id: string;
  flightNumber: string;
  date: string;
  aircraft: string;
}

export interface GenerateResponse {
  success: boolean;
  seats: string[];
}

export interface ErrorResponse {
  message: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const checkVouchers = async (flightNumber: string, date: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE}/api/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ flightNumber, date }),
  });

  if (!response.ok) {
    throw new Error('Failed to check vouchers');
  }

  const data: CheckResponse = await response.json();
  return data.exists;
};

export const generateVouchers = async (request: GenerateRequest): Promise<string[]> => {
  const response = await fetch(`${API_BASE}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message || 'Failed to generate vouchers');
  }

  const data: GenerateResponse = await response.json();
  return data.seats;
};
