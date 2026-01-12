import axios from 'axios'
import type { Product } from '../types/product'

const API_BASE_URL = 'https://fake.jsonmockapi.com'

export async function fetchProducts(): Promise<Product[]> {
  const response = await axios.get<Product[]>(`${API_BASE_URL}/products?length=50`)
  return response.data
}
