import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

export default function RootLayout() {
   const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: 2 } },
   });

   return (
      <QueryClientProvider client={queryClient}>
         <Stack
            screenOptions={{
               headerStyle: {
                  backgroundColor: '#f4511e',
               },
               headerTintColor: '#fff',
               headerTitleStyle: {
                  fontWeight: 'bold',
               },
            }}
         >
            <Stack.Screen options={{ headerShown: false }} name="index" />
         </Stack>
      </QueryClientProvider>
   );
}
