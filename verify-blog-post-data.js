// Verify that the specific blog post data is properly stored and retrievable
console.log('🔍 VERIFYING BLOG POST DATA...');
console.log('=====================================');

// Expected blog post data
const expectedBlogPost = {
  id: "c9b3dba2-fef4-446c-a66a-471a3adac4f9",
  user_id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Why I Use Graph ML to Design Smarter Cities",
  slug: "why-i-use-graph-ml-to-design-smarter-cities",
  excerpt: "A deep dive into how Graph Machine Learning (Graph ML) is revolutionizing traffic systems and city planning through predictive analytics. Based on my thesis at IAAC, this post explains how FLOW–SIGHT uses GNNs, traffic data, and geospatial visualization to create smarter urban systems.",
  content: "\nWhy I Use Graph ML to Design Smarter Cities\n\nUnlocking Urban Intelligence through Machine Learning\n\n📍 Barcelona, Spain   |   🧠 Computational Urbanism\n\n▌INTRODUCTION\n\nIn a world where urban congestion has become a global challenge, traditional traffic solutions no longer suffice. Cities demand intelligent systems that adapt in real-time, respond to population surges, and predict infrastructural needs ahead of time.\n\nThat's where Graph Machine Learning (Graph ML) enters. During my Master's thesis at the Institute for Advanced Architecture of Catalonia (IAAC), I developed FLOW–SIGHT, a project that explores the potential of Graph ML to optimize urban traffic through predictive insights—modeling, simulating, and visualizing traffic congestion across 8 global cities.\n\n──────────\n\n▌WHAT IS GRAPH ML?\n\nGraph ML is a type of machine learning built on networks or graphs—structures made of nodes (like intersections) and edges (like roads). Unlike traditional ML, Graph ML captures the relationships between data points, making it ideal for urban mobility, infrastructure mapping, and transport optimization.\n\n──────────\n\n▌THE CHALLENGE: CITIES THAT DON'T TALK\n\nMost cities still rely on:\n\nFixed-timing traffic lights\n\nHistoric congestion stats\n\nNon-dynamic urban planning tools\n\nThese approaches don't account for live factors such as weather, population density, public transport load, or air quality. This is where predictive models can change the game.\n\n──────────\n\n▌FLOW–SIGHT: HOW IT WORKS\n\nStep 1 — Data Fusion\n\nCollected 2 years of traffic, population, AQI, and weather data from 8 cities (e.g., London, Barcelona, Singapore, Mumbai).\n\nStep 2 — Graph Construction\n\nConverted urban traffic networks into graph datasets with weighted edges based on speed, volume, and congestion.\n\nStep 3 — Graph Model Training\n\nTrained a Graph Neural Network (GNN) to predict traffic bottlenecks and congestion build-up based on external triggers.\n\nStep 4 — Dashboard Visualization\n\nBuilt a Streamlit dashboard with Kepler.gl to display projected congestion across geospatial basemaps. Live query insights powered by Gemini.\n\n──────────\n\n▌WHY THIS MATTERS\n\n🧠 Better Decision-Making: Urban planners gain forecasted congestion heatmaps.\n\n🛰 Smart Cities: A foundation for AI-based, real-time traffic signal systems.\n\n🌱 Sustainability: Reduced emissions by rerouting congestion.\n\n🛠 Scalability: Easily deployable in any city with access to basic open mobility data.\n\n──────────\n\n▌WHAT'S NEXT?\n\nIn future iterations, I aim to integrate public transport prediction, emergency response simulation, and even drone mobility layers.\n\nThis blog is a space where I'll continue sharing behind-the-scenes tech workflows, design philosophies, and tools I use as a computational architect.\n\n──────────\n\n▌LET'S CONNECT\n\nIf you're an architect, urbanist, or data nerd passionate about shaping responsive cities, feel free to connect. I'm open to collaborations, freelance opportunities, or just sharing notes.\n\n📩 maheep.mouli.shashi@gmail.com   |   🌍 Portfolio   |  ",
  cover_image_url: null,
  tags: [
    "Graph ML",
    "Urban Analytics", 
    "AI Architecture",
    "Traffic Prediction",
    "Smart Cities",
    "Machine Learning in Urbanism"
  ],
  status: "published",
  created_at: "2025-07-30T20:44:25.935+00:00",
  updated_at: "2025-07-30T20:44:25.935+00:00"
};

console.log('📋 Expected blog post data:');
console.log('- ID:', expectedBlogPost.id);
console.log('- Title:', expectedBlogPost.title);
console.log('- Slug:', expectedBlogPost.slug);
console.log('- Status:', expectedBlogPost.status);
console.log('- Tags:', expectedBlogPost.tags.join(', '));
console.log('- Created:', expectedBlogPost.created_at);

// Check if the blog post is visible on the page
console.log('\n🔍 CHECKING PAGE CONTENT:');

const pageText = document.body.textContent;
const checks = [
  { name: 'Title', value: expectedBlogPost.title, found: pageText.includes(expectedBlogPost.title) },
  { name: 'Slug', value: expectedBlogPost.slug, found: pageText.includes(expectedBlogPost.slug) },
  { name: 'Graph ML Tag', value: 'Graph ML', found: pageText.includes('Graph ML') },
  { name: 'Urban Analytics Tag', value: 'Urban Analytics', found: pageText.includes('Urban Analytics') },
  { name: 'AI Architecture Tag', value: 'AI Architecture', found: pageText.includes('AI Architecture') },
  { name: 'Excerpt Start', value: 'A deep dive into how Graph Machine Learning', found: pageText.includes('A deep dive into how Graph Machine Learning') }
];

checks.forEach(check => {
  if (check.found) {
    console.log(`✅ Found "${check.name}": ${check.value}`);
  } else {
    console.log(`❌ Missing "${check.name}": ${check.value}`);
  }
});

// Check for blog cards
const blogCards = document.querySelectorAll('.project-card');
console.log(`\n📋 Blog cards found: ${blogCards.length}`);

if (blogCards.length === 0) {
  console.log('❌ No blog cards found on the page');
  console.log('💡 This suggests the blog posts are not being fetched from the database');
} else {
  console.log('✅ Blog cards are present on the page');
  
  // Check each card for the specific content
  blogCards.forEach((card, index) => {
    const cardText = card.textContent;
    if (cardText.includes(expectedBlogPost.title)) {
      console.log(`✅ Found the specific blog post in card ${index + 1}`);
    }
  });
}

// Check for any error messages
const errorMessages = document.querySelectorAll('.text-red-500, .text-red-600, .error, [class*="error"]');
if (errorMessages.length > 0) {
  console.log('\n❌ Error messages found:');
  errorMessages.forEach((error, index) => {
    console.log(`   Error ${index + 1}: ${error.textContent}`);
  });
} else {
  console.log('\n✅ No error messages found');
}

// Check for loading states
const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"], [class*="Loading"]');
if (loadingElements.length > 0) {
  console.log('\n⏳ Loading elements found - content might still be loading');
} else {
  console.log('\n✅ No loading elements found');
}

// Check for "No posts found" message
const noPostsMessage = document.querySelector('h3');
if (noPostsMessage && noPostsMessage.textContent.includes('No posts found')) {
  console.log('\n❌ "No posts found" message is displaying');
  console.log('💡 This indicates the blog posts are not being fetched from the database');
} else {
  console.log('\n✅ No "No posts found" message');
}

console.log('\n💡 TROUBLESHOOTING STEPS:');
console.log('1. Check the browser console for JavaScript errors');
console.log('2. Check the Network tab for failed Supabase requests');
console.log('3. Verify the blog post exists in your Supabase database');
console.log('4. Check if the blog post status is "published"');
console.log('5. Verify the user_id matches your authenticated user');
console.log('6. Check if the blog table exists and has the correct structure');

console.log('\n🔧 NEXT STEPS:');
console.log('- Run the database check script to verify the blog post exists');
console.log('- Check the Supabase dashboard for the blog_posts table');
console.log('- Verify the blog post has status = "published"');
console.log('- Check browser console for any fetch errors'); 