-- Insert the specific blog post if it doesn't exist
-- Run this in your Supabase SQL editor

-- First, check if the blog post already exists
DO $$
BEGIN
    -- Check if the blog post exists
    IF NOT EXISTS (
        SELECT 1 FROM blog_posts 
        WHERE id = 'c9b3dba2-fef4-446c-a66a-471a3adac4f9'
           OR slug = 'why-i-use-graph-ml-to-design-smarter-cities'
    ) THEN
        -- Insert the blog post
        INSERT INTO blog_posts (
            id,
            user_id,
            title,
            slug,
            excerpt,
            content,
            cover_image_url,
            tags,
            status,
            created_at,
            updated_at
        ) VALUES (
            'c9b3dba2-fef4-446c-a66a-471a3adac4f9',
            '550e8400-e29b-41d4-a716-446655440000',
            'Why I Use Graph ML to Design Smarter Cities',
            'why-i-use-graph-ml-to-design-smarter-cities',
            'A deep dive into how Graph Machine Learning (Graph ML) is revolutionizing traffic systems and city planning through predictive analytics. Based on my thesis at IAAC, this post explains how FLOW–SIGHT uses GNNs, traffic data, and geospatial visualization to create smarter urban systems.',
            'Why I Use Graph ML to Design Smarter Cities

Unlocking Urban Intelligence through Machine Learning

📍 Barcelona, Spain   |   🧠 Computational Urbanism

▌INTRODUCTION

In a world where urban congestion has become a global challenge, traditional traffic solutions no longer suffice. Cities demand intelligent systems that adapt in real-time, respond to population surges, and predict infrastructural needs ahead of time.

That''s where Graph Machine Learning (Graph ML) enters. During my Master''s thesis at the Institute for Advanced Architecture of Catalonia (IAAC), I developed FLOW–SIGHT, a project that explores the potential of Graph ML to optimize urban traffic through predictive insights—modeling, simulating, and visualizing traffic congestion across 8 global cities.

──────────

▌WHAT IS GRAPH ML?

Graph ML is a type of machine learning built on networks or graphs—structures made of nodes (like intersections) and edges (like roads). Unlike traditional ML, Graph ML captures the relationships between data points, making it ideal for urban mobility, infrastructure mapping, and transport optimization.

──────────

▌THE CHALLENGE: CITIES THAT DON''T TALK

Most cities still rely on:

Fixed-timing traffic lights

Historic congestion stats

Non-dynamic urban planning tools

These approaches don''t account for live factors such as weather, population density, public transport load, or air quality. This is where predictive models can change the game.

──────────

▌FLOW–SIGHT: HOW IT WORKS

Step 1 — Data Fusion

Collected 2 years of traffic, population, AQI, and weather data from 8 cities (e.g., London, Barcelona, Singapore, Mumbai).

Step 2 — Graph Construction

Converted urban traffic networks into graph datasets with weighted edges based on speed, volume, and congestion.

Step 3 — Graph Model Training

Trained a Graph Neural Network (GNN) to predict traffic bottlenecks and congestion build-up based on external triggers.

Step 4 — Dashboard Visualization

Built a Streamlit dashboard with Kepler.gl to display projected congestion across geospatial basemaps. Live query insights powered by Gemini.

──────────

▌WHY THIS MATTERS

🧠 Better Decision-Making: Urban planners gain forecasted congestion heatmaps.

🛰 Smart Cities: A foundation for AI-based, real-time traffic signal systems.

🌱 Sustainability: Reduced emissions by rerouting congestion.

🛠 Scalability: Easily deployable in any city with access to basic open mobility data.

──────────

▌WHAT''S NEXT?

In future iterations, I aim to integrate public transport prediction, emergency response simulation, and even drone mobility layers.

This blog is a space where I''ll continue sharing behind-the-scenes tech workflows, design philosophies, and tools I use as a computational architect.

──────────

▌LET''S CONNECT

If you''re an architect, urbanist, or data nerd passionate about shaping responsive cities, feel free to connect. I''m open to collaborations, freelance opportunities, or just sharing notes.

📩 maheep.mouli.shashi@gmail.com   |   🌍 Portfolio   |  ',
            NULL,
            ARRAY['Graph ML', 'Urban Analytics', 'AI Architecture', 'Traffic Prediction', 'Smart Cities', 'Machine Learning in Urbanism'],
            'published',
            '2025-07-30T20:44:25.935+00:00',
            '2025-07-30T20:44:25.935+00:00'
        );
        
        RAISE NOTICE 'Blog post inserted successfully!';
    ELSE
        RAISE NOTICE 'Blog post already exists, skipping insertion.';
    END IF;
END $$;

-- Verify the blog post was inserted
SELECT 
    id,
    title,
    slug,
    status,
    created_at,
    array_length(tags, 1) as tag_count
FROM blog_posts 
WHERE id = 'c9b3dba2-fef4-446c-a66a-471a3adac4f9'
   OR slug = 'why-i-use-graph-ml-to-design-smarter-cities';

-- Check all published blog posts
SELECT 
    id,
    title,
    slug,
    status,
    created_at
FROM blog_posts 
WHERE status = 'published'
ORDER BY created_at DESC; 