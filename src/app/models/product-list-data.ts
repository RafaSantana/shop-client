import { PaginationMeta } from './paginated-response';
import { Product } from './product';

export interface ProductListData {
  products: Product[];
  meta?: PaginationMeta;
  isLoading: boolean;
  error?: string | null;
  totalCartItems: number;
}
