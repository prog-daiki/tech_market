export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/items",
    "/properties",
    "/favorites"
  ]
};
