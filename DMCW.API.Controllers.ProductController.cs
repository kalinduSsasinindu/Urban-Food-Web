using DMCW.Repository.Data.DataService;
using DMCW.Repository.Data.Entities.product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DMCW.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductRepository _productRepository;

        public ProductController(ProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        // ... other endpoints

        // Existing endpoint - with user filtering
        [HttpGet("{productId}/reviews")]
        [Authorize]
        public async Task<ActionResult<List<ProductReview>>> GetProductReviews(string productId)
        {
            var reviews = await _productRepository.GetProductReviewsAsync(productId);
            return Ok(reviews);
        }

        // New endpoint - without user filtering
        [HttpGet("{productId}/all-reviews")]
        public async Task<ActionResult<List<ProductReview>>> GetAllProductReviews(string productId)
        {
            var reviews = await _productRepository.GetAllProductReviewsAsync(productId);
            return Ok(reviews);
        }
    }
} 