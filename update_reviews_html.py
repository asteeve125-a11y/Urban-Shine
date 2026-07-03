import os

filepath = r"c:\Users\DELL\Desktop\UShine\reviews.html"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Target 1: Add form
target1 = """    <div class="page-content">
        <div class="reviews-grid">"""

replacement1 = """    <div class="page-content">
        
        <!-- Leave a Review Form -->
        <div class="review-form-container" style="max-width: 600px; margin: 0 auto 40px auto; background: var(--white); padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid var(--border);">
            <h3 style="margin-bottom: 20px; color: var(--dark); text-align: center;">Leave a Review</h3>
            <form id="reviewForm">
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <input type="text" id="reviewerName" placeholder="Your Name" required style="flex: 1; padding: 10px; border: 1px solid var(--border); border-radius: 8px; font-family: inherit;">
                    <input type="text" id="reviewerCity" placeholder="City" required style="flex: 1; padding: 10px; border: 1px solid var(--border); border-radius: 8px; font-family: inherit;">
                </div>
                <div style="margin-bottom: 15px; text-align: center;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Rating</label>
                    <div id="starRating" style="color: #f1c40f; font-size: 24px; cursor: pointer;">
                        <i class="fas fa-star" data-rating="1"></i>
                        <i class="fas fa-star" data-rating="2"></i>
                        <i class="fas fa-star" data-rating="3"></i>
                        <i class="fas fa-star" data-rating="4"></i>
                        <i class="fas fa-star" data-rating="5"></i>
                    </div>
                    <input type="hidden" id="ratingValue" value="5">
                </div>
                <textarea id="reviewText" placeholder="Write your review here..." required style="width: 100%; height: 100px; padding: 10px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 15px; resize: vertical; font-family: inherit;"></textarea>
                <button type="submit" id="submitReviewBtn" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: bold; transition: 0.3s;">Submit Review</button>
            </form>
        </div>

        <div class="reviews-grid" id="reviewsGrid">"""

content = content.replace(target1, replacement1)

# Target 2: Add scripts
target2 = """    <script src="script.js"></script>
</body>"""

replacement2 = """    <script src="script.js"></script>
    <script>
        // Star Rating Logic
        const stars = document.querySelectorAll('#starRating .fa-star');
        const ratingInput = document.getElementById('ratingValue');

        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                ratingInput.value = rating;
                updateStars(rating);
            });
            star.addEventListener('mouseover', function() {
                const rating = this.getAttribute('data-rating');
                updateStars(rating, true);
            });
            star.addEventListener('mouseout', function() {
                updateStars(ratingInput.value);
            });
        });

        function updateStars(rating, isHover = false) {
            stars.forEach(star => {
                const starRating = star.getAttribute('data-rating');
                if (starRating <= rating) {
                    star.style.color = '#f1c40f'; // Yellow
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.style.color = '#ccc'; // Gray
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
        }

        // Fetch and render reviews
        async function loadReviews() {
            try {
                const response = await fetch('http://localhost:3000/api/reviews');
                const reviews = await response.json();
                const grid = document.getElementById('reviewsGrid');
                
                reviews.forEach(review => {
                    const card = document.createElement('div');
                    card.className = 'review-card';
                    
                    let starsHtml = '';
                    for (let i = 0; i < 5; i++) {
                        starsHtml += i < review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
                    }

                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random`;

                    card.innerHTML = `
                        <div class="stars" style="color:#f1c40f; margin-bottom:15px;">${starsHtml}</div>
                        <p class="review-text">"${review.reviewText}"</p>
                        <div class="reviewer">
                            <img src="${avatarUrl}" alt="${review.name}">
                            <div class="reviewer-info">
                                <h5>${review.name}</h5>
                                <span>${review.city}</span>
                            </div>
                        </div>
                    `;
                    // Prepend so newest is first
                    grid.prepend(card);
                });
            } catch(e) {
                console.error("Error loading reviews:", e);
            }
        }

        // Submit Review
        document.getElementById('reviewForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = document.getElementById('submitReviewBtn');
            const origText = btn.innerText;
            btn.innerText = 'Submitting...';
            btn.disabled = true;

            const newReview = {
                name: document.getElementById('reviewerName').value,
                city: document.getElementById('reviewerCity').value,
                rating: document.getElementById('ratingValue').value,
                reviewText: document.getElementById('reviewText').value
            };

            try {
                const response = await fetch('http://localhost:3000/api/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newReview)
                });
                
                if(response.ok) {
                    alert('Thank you for your review!');
                    location.reload(); 
                } else {
                    alert('Error submitting review.');
                    btn.innerText = origText;
                    btn.disabled = false;
                }
            } catch (e) {
                alert('Connection error.');
                btn.innerText = origText;
                btn.disabled = false;
            }
        });

        // Initial Load
        loadReviews();
    </script>
</body>"""

content = content.replace(target2, replacement2)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated reviews.html")
