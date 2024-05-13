import {BaseResponseDto} from "../../common/dto/base-response.dto";
import {Type} from "class-transformer";
import {ProductCardDto} from "./product-card.dto";

export class ProductsDto extends BaseResponseDto<ProductsDto> {
  @Type(() => ProductCardDto)
  cards: ProductCardDto[];

  totalBalance: number;

  spentInMonth: number;
}
