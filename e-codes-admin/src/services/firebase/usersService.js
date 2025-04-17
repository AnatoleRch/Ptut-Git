import { 
    //collection, 
    //writeBatch, 
    doc,
    getDocFromServer,
    onSnapshot 
  } from 'firebase/firestore';
  import { db } from './firebaseInit';
  //import { getOrgById } from './orgService';

  async function validateDepartmentUsersMap(departmentUsersMap, orgId) {
    if (!departmentUsersMap || Object.keys(departmentUsersMap).length === 0) {
      const docRef = doc(db, 'orgs', orgId, 'maps', 'departmentUsers');
      departmentUsersMap = (await getDocFromServer(docRef)).data()?.departmentUsersMap;
      console.log("DepartmentUsers read from db")
    }
    return departmentUsersMap ? departmentUsersMap : {};
  }
  
  export const getDepartmentUsersMap = (orgId, departmentUsersMap) => {
    return validateDepartmentUsersMap(departmentUsersMap, orgId);
  };

  export const getUsersByDepartment = async (orgId, departmentId) => {
    const departmentUsersMap = await validateDepartmentUsersMap(null, orgId);
    const usersMap = departmentId in departmentUsersMap ? departmentUsersMap[departmentId].usersMap : {};
    return Object.entries(usersMap).map(([userId, user]) => ({ id: userId, ...user }));
  };
  
  export const subscribeToDepartmentUsersMap = (orgId, callback) => {
    const docRef = doc(db, 'orgs', orgId, 'maps', 'departmentUsers');
    return onSnapshot(docRef, (doc) => {
      const departmentUsersMap = doc.data()?.departmentUsersMap || {};
      console.log("Users read from DB")
      callback(departmentUsersMap);
    });
  };

  export const subscribeToUsers = (orgId, callback) => {
    const docRef = doc(db, 'orgs', orgId, 'maps', 'departmentUsers');
    return onSnapshot(docRef, (doc) => {
      const departmentUsersMap = doc.data()?.departmentUsersMap || {};
      let usersMap = {};
      Object.values(departmentUsersMap).forEach(department => {
        usersMap = { ...usersMap, ...department.usersMap };
      });
      const users = Object.entries(usersMap).map(([userId, user]) => ({ id: userId, ...user }));
      console.log("Users read from DB")
      callback(users);
    });
  };
  