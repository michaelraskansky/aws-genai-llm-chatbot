import { createContext } from "react";
import { UserInfo } from "./types";

export const UserContext = createContext<UserInfo | null>(null);
