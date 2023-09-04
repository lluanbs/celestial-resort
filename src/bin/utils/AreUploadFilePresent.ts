import { Request } from "express";

/**
 * Check if a file is present in the request and optionally check for multiple files.
 * @param multiFilesPresent - Indicates whether multiple files are expected in the request.
 * @param request - The Express request object.
 * @returns True if a file is present and, if `multiFilesPresent` is true, there are no additional files. False otherwise.
 */
export default async (multiFilesPresent: boolean, request: Request) => {
  // Check if a file is present in the request
  if (!request.file) return false;
  
  // If `multiFilesPresent` is true, check if there are no additional files in the request
  if (multiFilesPresent && !request.files) return false;

  // Return true if all conditions pass
  return true;
};