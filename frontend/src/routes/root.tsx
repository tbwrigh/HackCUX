import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import QueryApp from '../QueryApp.tsx'

const defaultQueryFn = async ({ queryKey }) => {
  const url = `${import.meta.env.VITE_BASE_URL}/${queryKey[0] == "POST" || queryKey[0] == "PUT" ? queryKey.slice(2).join("/") : queryKey.slice(1).join("/")}/`;
  return fetch(
    url,
    {
      method: queryKey[0],
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      credentials: 'include',
      body: queryKey[0] == "POST" || queryKey[0] == "PUT" ? queryKey[1] : null,
    }
  ).then((res) => res.json())
}

// provide the default query function to your app with defaultOptions
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
})

export default function Root() {

  return (
    <QueryClientProvider client={queryClient}>
      <QueryApp />
    </QueryClientProvider>
  )
}
