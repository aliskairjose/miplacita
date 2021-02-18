// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
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
    onlyLetter: 'Sólo se permiten caracteres',
    matchError: 'Los campos contraseña y Repetir contraseña deben coincidir',
    onlyDigits: 'Sólo se permiten números',
    maxStock: 'Su plan sólo permite un máximo de 8 en su inventario'
  },
  whatsappContact: '+584141236547',
  editorKey: '3gm63w53b8mw3o2nagwgdo0mt6mpeq6qg59bzub6j6ael646',
  emailPattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
