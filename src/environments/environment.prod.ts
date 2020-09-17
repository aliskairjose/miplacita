export const environment = {
  production: true,
  instagram_token: 'INSTAGRAM_TOKEN',
  stripe_token: 'STRIPE_PUBLISHABLE_KEY',
  paypal_token: 'PAYPAL_CLIENT_ID',
  apiUrl: 'http://marketplace.dev.cronapis.com:3010/api/',
  standardImage: '../../../../assets/images/marketplace/images/placeholder.jpg',
  orderStatus: [ 'Por aprobar', 'aprobado', 'en proceso', 'cancelado', 'pagado', 'entregado', 'devuelto' ],
  errorForm: {
    invalidEmail: 'Email inválido.',
    required: 'Campo obligatorio.',
    invalidUrl: 'Ingere una url válida.',
    onlyLetter: 'Solo se permiten caracteres',
    matchError: 'Los campos contraseña y Repetir contraseña deben coincidir',
    onlyDigits: 'Sólo se permiten números'
  }
};
