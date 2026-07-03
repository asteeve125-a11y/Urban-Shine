import os

filepath = r"c:\Users\DELL\Desktop\UShine\admin.html"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """    </div>

    <script>"""

replacement1 = """        
        <h1 style="margin-top: 50px;">⭐ Customer Reviews</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Date Received</th>
                    <th>Customer Name</th>
                    <th>Location</th>
                    <th>Rating</th>
                    <th>Review</th>
                </tr>
            </thead>
            <tbody id="reviewsTableBody">
                <tr><td colspan="6" style="text-align:center;">Loading reviews...</td></tr>
            </tbody>
        </table>
    </div>

    <script>"""

content = content.replace(target1, replacement1)

target2 = """        // Fetch on load
        fetchBookings();"""

replacement2 = """        async function fetchReviews() {
            const tbody = document.getElementById('reviewsTableBody');
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading reviews...</td></tr>';
            
            try {
                const response = await fetch('http://localhost:3000/api/reviews');
                const reviews = await response.json();
                
                if (reviews.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No reviews found.</td></tr>';
                    return;
                }
                
                tbody.innerHTML = '';
                reviews.forEach(r => {
                    const tr = document.createElement('tr');
                    const receivedDate = new Date(r.created_at + 'Z').toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                    });
                    
                    let starsHtml = '';
                    for (let i = 0; i < 5; i++) {
                        starsHtml += i < r.rating ? '<i class="fas fa-star" style="color:#f1c40f;"></i>' : '<i class="far fa-star" style="color:#ccc;"></i>';
                    }
                    
                    tr.innerHTML = `
                        <td>#${r.id}</td>
                        <td>${receivedDate}</td>
                        <td><strong>${r.name}</strong></td>
                        <td>${r.city}</td>
                        <td>${starsHtml}</td>
                        <td><em>"${r.reviewText}"</em></td>
                    `;
                    tbody.appendChild(tr);
                });
            } catch (error) {
                console.error("Error fetching reviews:", error);
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Error loading reviews. Make sure the server is running.</td></tr>';
            }
        }
        
        // Fetch on load
        fetchBookings();
        fetchReviews();"""

content = content.replace(target2, replacement2)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated admin.html")
