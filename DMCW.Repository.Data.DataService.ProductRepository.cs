using DMCW.Repository.Data.Entities.product;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMCW.Repository.Data.DataService
{
    public class ProductRepository
    {
        private readonly MongoDBContext _context;

        public ProductRepository(MongoDBContext context)
        {
            _context = context;
        }

        // ... existing methods

        // Original method with user filtering
        public async Task<List<ProductReview>> GetProductReviewsAsync(string productId)
        {
            // Get the product
            var filter = Builders<Product>.Filter.Eq(x => x.Id, productId);
            var product = await _context.Products.FindOneAsync(filter);

            if (product == null || product.ProductReviews == null || product.ProductReviews.Count == 0)
            {
                return new List<ProductReview>();
            }

            // Return only active reviews
            var reviews = product.ProductReviews
                .Where(r => r.IsDeleted != true)
                .OrderByDescending(r => r.CreatedAt)
                .ToList();

            return reviews;
        }

        // New method that bypasses user filtering to get all product reviews
        public async Task<List<ProductReview>> GetAllProductReviewsAsync(string productId)
        {
            // Get the product using the base collection to bypass user filtering
            var baseCollection = _context.GetBaseCollection<Product>("Product");
            var filter = Builders<Product>.Filter.And(
                Builders<Product>.Filter.Eq(x => x.Id, productId),
                Builders<Product>.Filter.Eq("IsDeleted", false)
            );
            
            var product = await baseCollection.Find(filter).FirstOrDefaultAsync();

            if (product == null || product.ProductReviews == null || product.ProductReviews.Count == 0)
            {
                return new List<ProductReview>();
            }

            // Return only active reviews
            var reviews = product.ProductReviews
                .Where(r => r.IsDeleted != true)
                .OrderByDescending(r => r.CreatedAt)
                .ToList();

            return reviews;
        }
    }
} 