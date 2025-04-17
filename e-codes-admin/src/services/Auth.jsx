import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToAuthChanges, logoutUser } from './firebase/authService';
//import { getOrg } from '../services/orgService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

async function validateUser(user) {
  const token = await user.getIdTokenResult();
  const roles = token.claims.roles || {};
  if (!(roles.OrgAdmin || roles.RotasAdmin || roles.SuperAdmin)) {
    throw new Error('User does not have access to the admin console')
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState(null);
  //const [org, setOrg] = useState(null)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      console.log("User data read")
      setCurrentUser(user);
      if (user) {
        try {
          await validateUser(user);
          const token = await user.getIdTokenResult();
          setOrgId(token.claims.orgId);
          // can use the below for passing org statically if needed
          // const org = await getOrg(token.claims.orgId)
          // setOrg(org)
        } catch (err) {
          setCurrentUser(null);
          // did not use await on purpose to allow showing error message
          logoutUser(user);
        }
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    orgId,
    //org,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
