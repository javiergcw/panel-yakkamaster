import { HttpClient } from './HttpClient';

/**
 * Instancia única del cliente HTTP para usar en todos los servicios.
 * Configuración: NEXT_PUBLIC_API_URL en .env (ej: https://api.ejemplo.com)
 */
export const httpClient = new HttpClient();
