import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, NotFoundException,
  Param,
  Patch,
  Post, UsePipes, ValidationPipe,
} from '@nestjs/common';

import { ProductModel } from './product.model';
import { FindProductDto } from './dto/find-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';

@Controller('product')
export class ProductController {
  constructor(private _productService: ProductService) {}

  @Post('create')
  async create(@Body() dto: CreateProductDto): Promise<ProductModel> {
    return this._productService.create(dto);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<ProductModel> {
    const product = await this._productService.findById(id);

    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }

    return product;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedProduct = await this._productService.deleteById(id);

    if (!deletedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: CreateProductDto) {
    const updatedProduct = await this._productService.updateById(id, dto);

    if (!updatedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }

    return updatedProduct;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindProductDto) {
    return this._productService.findWithReviews(dto);
  }
}
