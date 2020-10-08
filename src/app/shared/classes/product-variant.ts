export interface ProductVariant {
  id?: string;
  name?: string;
  value?: string; // Hexadecimal para color, string para size
  store?: string; // Id de la tienda
  type?: string; // coloc | size
}