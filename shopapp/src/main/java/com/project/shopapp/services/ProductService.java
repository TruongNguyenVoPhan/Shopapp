package com.project.shopapp.services;

import com.project.shopapp.dtos.ProductDTO;
import com.project.shopapp.dtos.ProductImageDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.exceptions.InvalidParamException;
import com.project.shopapp.models.Category;
import com.project.shopapp.models.Product;
import com.project.shopapp.models.ProductImage;
import com.project.shopapp.repositories.CategoryRepository;
import com.project.shopapp.repositories.ProductImageRepository;
import com.project.shopapp.repositories.ProductRepository;
import com.project.shopapp.responses.ProductResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService{
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    @Override
    @Transactional
    public Product createProduct(ProductDTO productDTO) throws Exception {
        Category existingCategory = categoryRepository
                .findById(productDTO.getCategoryId())
                .orElseThrow(() ->
                        new DataNotFoundException(
                                "Cannot find category with id: "+productDTO.getCategoryId()));
        Product newProduct = Product.builder()
                .name(productDTO.getName())
                .price(productDTO.getPrice())
                .description(productDTO.getDescription())
                .thumbnail(productDTO.getThumbnail())
                .category(existingCategory)
                .active(true)
                .build();
        return productRepository.save(newProduct);
    }

    @Override
    public Product getProductById(long productId) throws Exception {
        Optional<Product> optionalProduct = productRepository.getDetailProduct(productId);
        if(optionalProduct.isPresent()) {
            return optionalProduct.get();
        }
        throw new DataNotFoundException("Cannot find product with id =" + productId);
    }

    @Override
    public List<Product> findProductByIds(List<Long> productIds) {
        return productRepository.findProductByIds(productIds);
    }

    @Override
    public Page<ProductResponse> getAllProducts(Long categoryId,String keyword
                                               , PageRequest pageRequest) {
        //Laydanh sach san pham theo trang(page) va gioi han(limit)
        Page<Product> productsPage;
        productsPage = productRepository.searchProducts(categoryId,keyword,pageRequest);
        return productsPage.map(ProductResponse::fromProduct);
    }

    @Override
    @Transactional
    public Product updateProduct(long id, ProductDTO productDTO) throws Exception {
        Product existingProduct = getProductById(id);

        Category existingCategory = categoryRepository
                .findById(productDTO.getCategoryId())
                .orElseThrow(() ->
                        new DataNotFoundException(
                                "Cannot find category with id: " + productDTO.getCategoryId()));

        existingProduct.setName(productDTO.getName());
        existingProduct.setCategory(existingCategory);
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setDescription(productDTO.getDescription());

        if(productDTO.getThumbnail() != null && !productDTO.getThumbnail().isEmpty()) {
            existingProduct.setThumbnail(productDTO.getThumbnail());
        }

        return productRepository.save(existingProduct);
    }
    @Override
    public void deleteProduct(long id) throws Exception {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new Exception("Cannot find product"));

        product.setActive(false);
        productRepository.save(product);
    }

    @Override
    @Transactional
    public boolean existsByName(String name) {
        return productRepository.existsByNameIgnoreCase(name);
    }

    @Override
    @Transactional
    public ProductImage createProductImage(
            Long productId,
            ProductImageDTO productImageDTO) throws Exception, InvalidParamException {
        Product existingProduct = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new DataNotFoundException(
                                "Cannot find category with id: "+productImageDTO.getProductId()));
        ProductImage newProductImage = ProductImage.builder()
                .product(existingProduct)
                .imageUrl(productImageDTO.getImageUrl())
                .build();
        //khong cho insert qua 5 anh cho 1 san pham
        int size = productImageRepository.findByProductId(productId).size();
        if(size > ProductImage.MAXIMUM_IMAGES_PER_PRODUCT){
            throw new InvalidParamException("Number of images must be <= "
                    +ProductImage.MAXIMUM_IMAGES_PER_PRODUCT);
        }
        return productImageRepository.save(newProductImage);
    }

    public Product save(Product product){
        return productRepository.save(product);
    }
}
