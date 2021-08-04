export const STATUSES = [
  { value: 'active', text: 'Activo' },
  { value: 'inactive', text: 'Inactivo' },
  { value: 'blocked', text: 'Bloqueado' },
];

export const ERROR_FORM = {
  invalidEmail: 'Email inválido.',
  required: 'Campo obligatorio.',
  invalidUrl: 'Ingere una url válida.',
  onlyLetter: 'Solo se permiten caracteres',
  matchError: 'Los campos contraseña y Repetir contraseña deben coincidir',
  onlyDigits: 'Solo se permiten números',
  maxStock: 'Su plan solo permite un máximo de 8 en su inventario'
};
export const BASIC_BENEFITS = [
  'Catálogo limitado a 10 productos',
  'Inventario de 10 productos',
  'Chat integrado',
  'Url para redes sociales',
  'Edición de tienda',
  'Gestión de clientes'
];

export const BENEFITS = [
  'Control de inventario',
  'Gestión de clientes',
  'Transacciones ilimitadas',
  'Pasarela de Pago TDC',
  'Gestión de imagen de tienda',
  'Plan de compensaciones a clientes referidos',
  'Cupones de descuentos'
];

export const MONTHS = [
  { value: 1, name: 'Enero' },
  { value: 2, name: 'Febrero' },
  { value: 3, name: 'Marzo' },
  { value: 4, name: 'Abril' },
  { value: 5, name: 'Mayo' },
  { value: 6, name: 'Junio' },
  { value: 7, name: 'Julio' },
  { value: 8, name: 'Agosto' },
  { value: 9, name: 'Septiembre' },
  { value: 10, name: 'Octubre' },
  { value: 11, name: 'Noviembre' },
  { value: 12, name: 'Diciembre' }
];

export const EMAIL_PATTERN = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
export const WHATSAPP_CONTACT = '+50766708118';
export const MAX_PRODUCTS = 8;
export const STANDARD_IMAGE = '/assets/images/marketplace/images/placeholder.jpg';
export const ORDER_STATUS = [ 'por aprobar', 'aprobado', 'en proceso', 'cancelado', 'pagado', 'entregado', 'devuelto' ];
export const INSTAGRAM_TOKEN = 'INSTAGRAM_TOKEN';
