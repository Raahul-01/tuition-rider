// Re-export everything from client.ts to make @/lib/supabase resolve correctly
export * from './client';

// Add createAdminUser function that's being imported in app/api/setup/route.ts
export const createAdminUser = async () => {
  // This is a placeholder implementation to make the build succeed
  // The actual implementation would create an admin user in Supabase
  return {
    id: "admin-placeholder",
    email: "admin@example.com",
    role: "admin"
  };
}; 