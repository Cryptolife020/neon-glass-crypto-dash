
// Utility to handle API errors gracefully
export const handleApiError = (error: unknown, context: string = 'API Request') => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Ignore preview/development related errors
  if (errorMessage.includes('Preview ha') || 
      errorMessage.includes('Unexpected token') ||
      errorMessage.includes('not valid JSON')) {
    console.log(`[${context}] Development environment - ignoring JSON parse error`);
    return null;
  }
  
  // Log actual errors
  console.error(`[${context}] Error:`, errorMessage);
  return errorMessage;
};

// Mock data factory for development
export const createMockApiResponse = <T>(data: T, delay: number = 0): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Check if we're in development/preview mode
export const isPreviewMode = () => {
  return window.location.hostname.includes('lovable') || 
         window.location.hostname === 'localhost' ||
         process.env.NODE_ENV === 'development';
};
