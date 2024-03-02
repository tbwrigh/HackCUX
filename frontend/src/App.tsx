import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import QueryApp from './QueryApp.tsx'

const queryClient = new QueryClient();

export default function App() {

   return (
     <QueryClientProvider client={queryClient}>
       <QueryApp />
     </QueryClientProvider>
   )
}