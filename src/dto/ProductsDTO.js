export default class ProductDTO {
    constructor(product) {
        this.id = product._id;         
        this.title = product.title;
        this.price = product.price;
        this.stock = product.stock;
        this.description = product.description || null; 
    }

    
    static fromList(products) {
        return products.map(p => new ProductDTO(p));
    }
}