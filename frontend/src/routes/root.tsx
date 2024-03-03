import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import QueryApp from '../QueryApp.tsx'

const defaultQueryFn = async ({ queryKey }) => {
  return fetch(
    // `${import.meta.env.VITE_BASE_URL}/new_whiteboard/${whiteboardName}`,
    `${import.meta.env.VITE_BASE_URL}/${queryKey[1]}/`,
    {
      method: queryKey[0],
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      credentials: 'include',
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
