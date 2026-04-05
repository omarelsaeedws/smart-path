// Disable the ESLint rule because context files legitimately export both components and hooks
/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useEffect, useState } from "react";

import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// ------------------------------------------------------------------------
// Auth Provider
// ------------------------------------------------------------------------
export const AuthProvider = ({ children }) => {
  // ------------------------------------------------------------------------
  // Local State
  // ------------------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // State to manage loading status while verifying authentication state initially
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // ------------------------------------------------------------------------
  // Data Fetching & Refresh
  // ------------------------------------------------------------------------
  // Method to manually pull the freshest profile from firestore after an update
  const refreshUserProfile = async () => {
    if (currentUser) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } catch (error) {
        console.error("Error refreshing user profile:", error);
      }
    }
  };

  // ------------------------------------------------------------------------
  // Effects (Auth State Subscription)
  // ------------------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);

      if (user) {
        if (user.emailVerified) {
          try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const profileData = userDoc.data();
              if (user.email === "admin@smartpath.com" && profileData.role !== "admin") {
                await setDoc(userDocRef, { role: "admin" }, { merge: true });
                profileData.role = "admin";
              }
              setUserProfile(profileData);
            } else {
              const newProfile = {
                profileCompleted: false,
                firstLogin: true,
                email: user.email,
                role: user.email === "admin@smartpath.com" ? "admin" : "user",
                status: "active",
                createdAt: serverTimestamp(),
              };
              await setDoc(userDocRef, newProfile);
              setUserProfile(newProfile);
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setUserProfile(null); 
          }
        } else {
          // Do not fetch or create profile if email is not verified
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
      setInitialLoad(false);
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []);

  // ------------------------------------------------------------------------
  // Context Value & Render
  // ------------------------------------------------------------------------
  const value = {
    currentUser,
    userProfile,
    isAdmin: userProfile?.role === "admin",
    loading,
    refreshUserProfile,
  };
  return (
    <AuthContext.Provider value={value}>
      {!initialLoad ? (
        children
      ) : (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
