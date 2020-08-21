export interface Paginate {
  limit: number; // Cantidad de resultados por pagina
  totalDocs: number; // Total de registrios
  totalPages: number; // Total de paginas disponibles
  prevPage: number; // Numero de la pagina anterior
  page: number; // Pagina donde se ubica, por defecto 1
  nextPage: number; // Numero de la pagina siguiente
  pagingCounter: number; // numer del primer documento de la lista
  hasPrevPage: boolean;
  hasNextPage: boolean;
}
