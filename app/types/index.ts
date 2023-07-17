import { Listing, Purchase, User } from "@prisma/client";

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
};

export type SafePurchase = Omit<
  Purchase,
  "createdAt" | "listing"
> & {
  createdAt: string;
  listing: SafeListing;
};
