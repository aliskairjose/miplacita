export const environment = {
  production: true,
  instagram_token: 'INSTAGRAM_TOKEN',
  stripe_token: 'STRIPE_PUBLISHABLE_KEY',
  paypal_token: 'PAYPAL_CLIENT_ID',
  apiUrl: 'https://marketplace.dev.cronapis.com:3020/api/',
  standardImage: '../../../../assets/images/marketplace/images/placeholder.jpg',
  orderStatus: [ 'por aprobar', 'aprobado', 'en proceso', 'cancelado', 'pagado', 'entregado', 'devuelto' ],
  maxProducts: 8,
  errorForm: {
    invalidEmail: 'Email inválido.',
    required: 'Campo obligatorio.',
    invalidUrl: 'Ingere una url válida.',
    onlyLetter: 'Solo se permiten caracteres',
    matchError: 'Los campos contraseña y Repetir contraseña deben coincidir',
    onlyDigits: 'Sólo se permiten números',
    maxStock: 'Su plan sólo permite un máximo de 8 en su inventario'
  },
  whatsappContact: '+584141236547',
  editorKey: '3gm63w53b8mw3o2nagwgdo0mt6mpeq6qg59bzub6j6ael646'


};
