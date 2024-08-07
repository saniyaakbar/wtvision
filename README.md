This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Custom useApi:

usage:
## example start

const api = useApi('https://api.example.com'); // Pass your base URL here

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/data');
        console.log('Data:', response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [api]);
  
## example end

explaination:

Purpose: useApi custom hook manages Axios instance for authenticated API requests.
Authentication: Uses accessToken and refreshToken from Redux state (selectAuth).
Interceptors: Configures Axios interceptors for request (Authorization header) and response (token refresh on 401).
Usage: Enables components to use useApi for authenticated API calls by importing and calling the hook with a baseURL.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.


## For login test, only use dummy username and password:

username: bm
password: kk
 
