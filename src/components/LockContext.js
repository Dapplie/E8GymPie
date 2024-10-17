// LockContext.js
import React, { createContext, useState } from 'react';

const LockContext = createContext();

export const LockProvider = ({ children }) => {
  const [lockedClasses, setLockedClasses] = useState([]);

  const lockClass = (className) => {
    setLockedClasses([...lockedClasses, className]);
  };

  const isClassLocked = (className) => {
    return lockedClasses.includes(className);
  };

  return (
    <LockContext.Provider value={{ lockClass, isClassLocked }}>
      {children}
    </LockContext.Provider>
  );
};

export default LockContext;
