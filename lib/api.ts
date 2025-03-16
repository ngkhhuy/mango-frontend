import { Mango } from "@/types/mango";

const API_URL = 'https://mango-backend-q7bx.onrender.com/api';

export async function getMangoes(): Promise<Mango[]> {
  try {
    const response = await fetch(`${API_URL}/mangoes`);
    if (!response.ok) {
      throw new Error('Failed to fetch mangoes');
    }
    const data = await response.json();
    
    // Debug log
    console.log('API Response:', {
      status: response.status,
      data: data
    });
    
    // Kiểm tra cấu trúc dữ liệu
    if (!Array.isArray(data)) {
      console.error('API did not return an array:', data);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching mangoes:', error);
    return [];
  }
} 