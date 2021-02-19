export const STATUSES = [
  { value: 'active', text: 'Activo' },
  { value: 'inactive', text: 'Inactivo' },
  { value: 'blocked', text: 'Bloqueado' },
];

export const ERROR_FORM = {
  invalidEmail: 'Email inválido.',
  required: 'Campo obligatorio.',
  invalidUrl: 'Ingere una url válida.',
  onlyLetter: 'Sólo se permiten caracteres',
  matchError: 'Los campos contraseña y Repetir contraseña deben coincidir',
  onlyDigits: 'Sólo se permiten números',
  maxStock: 'Su plan sólo permite un máximo de 8 en su inventario'
};
export const SIZES = [
  { "_id": "1", "value": "s", "name": "S" },
  { "_id": "2", "value": "m", "name": "M" },
  { "_id": "3", "value": "l", "name": "L" },
  { "_id": "4", "value": "xl", "name": "XL" },
  { "_id": "5", "value": "xxl", "name": "XXL" }
];

export const COLORS = [
  { "_id": "1", "value": "#000000", "name": "Negro" },
  { "_id": "2", "value": "#ffffff", "name": "Blanco" },
  { "_id": "3", "value": "#ff0202", "name": "Rojo" },
  { "_id": "4", "value": "#f8ff02", "name": "Amarillo" },
  { "_id": "5", "value": "#0297ff", "name": "Azul" }
];

export const EMAIL_PATTERN = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
export const WHATSAPP_CONTACT = '+584141236547';
export const MAX_PRODUCTS = 8;
export const STANDARD_IMAGE = '../../../../assets/images/marketplace/images/placeholder.jpg';
export const ORDER_STATUS = [ 'por aprobar', 'aprobado', 'en proceso', 'cancelado', 'pagado', 'entregado', 'devuelto' ];
export const INSTAGRAM_TOKEN = 'INSTAGRAM_TOKEN';
