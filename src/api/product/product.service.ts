import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, ProductItemDto } from './dto/create-product.dto';
import {
  UpdateProductDto,
  UpdateProductItemDto,
} from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductItem, ProductMedia } from './entities';
import { Repository } from 'typeorm';
import { BaseService, GetMediaService } from 'src/services';
import { slugify } from 'src/utils';
import { QrProductDto } from './dto';
import { Category } from '../categories/entities';
import { BrandsService } from '../brands/brands.service';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductMedia)
    private readonly productMediaRepo: Repository<ProductMedia>,
    @InjectRepository(ProductItem)
    private readonly productItemRepo: Repository<ProductItem>,
    private readonly mediaService: GetMediaService,
    private readonly brandService: BrandsService,
  ) {
    super(productRepo);
  }
  async create(createProductDto: CreateProductDto) {
    const firstItem =
      createProductDto.items.length > 0 ? createProductDto.items[0] : null;
    const product = (await this.createData(Product, {
      name: createProductDto.name,
      content: createProductDto.content,
      name_slugify: slugify(createProductDto.name),
      category: await this.onCategory(createProductDto.category_id),
      brand: await this.brandService.onBrand(createProductDto.brand_id),
      price: createProductDto.price || firstItem?.price || 0,
      special_price:
        createProductDto.special_price || firstItem?.special_price || 0,
      quantity: createProductDto.quantity || firstItem?.quantity || 0,
    }).then((res) => res.context)) as Product;
    await this.saveMultipleProductMedia(product, createProductDto.media_ids);
    await this.saveMultipleProductItem(product, createProductDto.items);
    return this.findOne(product.id);
  }

  async findAll(query: QrProductDto) {
    return this.paginate(query, {
      where: {
        name: this.getLike(query.search),
        category: { id: query.category_id },
        brand: { id: query.brand_id },
        active: this.getBoolean(query.active),
        special_price: this.getRange(
          query.min_special_price,
          query.max_special_price,
        ),
      },
      order: this.getSort(query?.sort),
      relations: {
        medias: this.getIncludes('medias', query.includes)
          ? { media: true }
          : false,
        items: this.getIncludes('items', query.includes),
        category: this.getIncludes('category', query.includes),
        brand: this.getIncludes('brand', query.includes),
      },
    });
  }

  findOne(id: any) {
    return this.detail(
      id,
      { throwNotFound: true, allowSlugify: true },
      {
        relations: {
          medias: { media: true },
          items: true,
          category: true,
          brand: { media: true },
        },
      },
    );
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = (await this.findAndUpdate(id, {
      name: updateProductDto.name,
      content: updateProductDto.content,
      active: updateProductDto.active,
      category: await this.onCategory(updateProductDto.category_id),
      brand: await this.brandService.onBrand(updateProductDto.brand_id),
      price: updateProductDto.price,
      special_price: updateProductDto.special_price,
      quantity: updateProductDto.quantity,
    }).then((res) => res.context)) as Product;
    await this.saveMultipleProductMedia(product, updateProductDto.media_ids);
    await this.updateMultipleProductItem(product, updateProductDto.items);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.softDelete(id);
  }
  async onCategory(id?: number) {
    if (!id) return undefined;
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
  async saveMultipleProductMedia(product: Product, media_ids = []) {
    try {
      const productMediaEntities = await Promise.all(
        media_ids.map(async (media_id) => ({
          product,
          media: await this.mediaService.getOne(media_id),
        })),
      );
      await this.productMediaRepo.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.delete(
            this.productMediaRepo.target,
            { product },
          );
          await transactionalEntityManager.save(
            this.productMediaRepo.target,
            productMediaEntities,
          );
        },
      );
    } catch (error) {}
    return;
  }
  async saveMultipleProductItem(product, items: ProductItemDto[] = []) {
    if (items.length === 0) return;
    const productItems = items.map((item) => ({
      product,
      ...item,
    }));
    await this.productItemRepo.save(productItems);
    return;
  }
  async updateMultipleProductItem(product, items: UpdateProductItemDto[] = []) {
    await this.saveMultipleProductItem(
      product,
      items.filter((i) => !i.id),
    );
    await Promise.all(
      items
        .filter((i) => i.id)
        .map(async (item) => {
          const dataItem = await this.productItemRepo.findOne({
            where: { id: item.id },
          });
          if (!dataItem) return;
          await this.productItemRepo.save(Object.assign(dataItem, item));
          return;
        }),
    );
    return;
  }
}
