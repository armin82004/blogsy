# Blogsy

> Your daily dose of insights and stories.

Blogsy is a modern blogging platform for discovering and sharing insightful articles, tutorials, and stories across a wide range of topics — from Technology and AI to Health, Travel, Finance, and more.

🔗 **Live Demo:** [blogsy-v3g3.vercel.app](https://blogsy-v3g3.vercel.app)

---

## Features

- **Home feed** — Curated Editor's Picks and Trending Topics to surface the best content
- **Posts browser** — Browse all published articles in one place
- **Category tags** — Filter by Technology, Health & Wellness, Travel, Personal Development, Finance, Food & Recipes
- **Newsletter** — Subscribe for the latest updates
- **About page** — Mission, history, and team info
- **Responsive design** — Optimised for desktop and mobile

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js |
| Deployment | Vercel |
| Storage | Supabase (image storage) |

> Update this table to reflect your full stack (e.g. database, auth, styling library).

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/blogsy.git
cd blogsy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL, keys, and any other required variables

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the root of the project and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Add any additional variables your project requires.

---

## Project Structure

```
blogsy/
├── app/               # Next.js app directory (pages & layouts)
│   ├── page.tsx       # Home page
│   ├── posts/         # Posts listing & detail pages
│   └── about/         # About page
├── components/        # Reusable UI components
├── public/            # Static assets
└── ...
```

> Adjust the structure above to match your actual file layout.

---

## Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Push your repository to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add your environment variables in the Vercel dashboard
4. Deploy

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

Built with ❤️ by the Blogsy team.
