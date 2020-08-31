import { Product } from './tm.product';

// Order
export interface Order {
    shippingDetails?: any;
    product?: Product;
    orderId?: any;
    totalAmount?: any;
}
