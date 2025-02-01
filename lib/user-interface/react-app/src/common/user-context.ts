import { Dispatch, SetStateAction, createContext } from "react";


export type UserProfile = {
  defaultApplicationId: string
}

export type UserContextValue = {
  userRoles: string[];
  userEmail: string;
  userProfile: UserProfile ;

  setUserEmail: Dispatch<SetStateAction<string>>;
  setUserRoles: Dispatch<SetStateAction<string[]>>;
  setUserProfile: Dispatch<UserProfile>;
};

export const userContextDefault: UserContextValue = {
  userRoles: [],
  userEmail: "",
  userProfile: {
    defaultApplicationId: ""
  },
  setUserRoles: () => {},
  setUserEmail: () => {},
  setUserProfile: () => {},
};

export const UserContext = createContext(userContextDefault);
