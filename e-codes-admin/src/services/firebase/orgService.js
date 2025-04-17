import { 
    //collection, 
    //addDoc,
    getDoc,
    //getDocs,
    doc, 
    deleteDoc, 
    updateDoc, 
    //query, 
    //where,
    onSnapshot 
  } from 'firebase/firestore';
  import { db } from './firebaseInit'
  
  export const getOrgById = async (orgId) => {
    const docRef = doc(db, 'orgs', orgId);
    const org = (await getDoc(docRef)).data();
    return { id: orgId, ...org };
  };
  
  export const subscribeToOrg = (orgId, callback) => {
    const docRef = doc(db, 'orgs', orgId);
    return onSnapshot(docRef, (doc) => {
      const org = {
        id: doc.id,
        ...doc.data()
      };
      console.log("Org read from DB")
      callback(org);
    });
  };
  
  export const updateOrg = (orgId, updates) => {
    updates.updatedAt = new Date()
    const projectRef = doc(db, 'orgs', orgId);
    return updateDoc(projectRef, updates);
  };
  
  export const deleteOrg = (orgId) => {
    return deleteDoc(doc(db, 'orgs', orgId));
  };
  