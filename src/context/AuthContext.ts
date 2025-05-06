import { createContext } from "react";
import { Admin } from "../types/Admin";

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  setAdmin: (admin: Admin | null) => void;
}

export const AuthContextInstance = createContext<AuthContextType>({
  admin: null,
  loading: true,
  setAdmin: () => {},
});
