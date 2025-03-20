import { ProductResponse } from '../types/product';

const API_URL = 'https://dummyjson.com/products';

export async function fetchProducts(limit = 30, skip = 0): Promise<ProductResponse> {
  try {
    const response = await fetch(`${API_URL}?limit=${limit}&skip=${skip}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function fetchProductById(id: number) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
} 