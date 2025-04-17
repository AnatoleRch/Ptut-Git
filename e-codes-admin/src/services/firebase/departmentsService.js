import { 
    collection, 
    writeBatch, 
    doc,
    query,
    onSnapshot 
  } from 'firebase/firestore';
  import { db } from './firebaseInit';
  import { getOrgById } from './orgService';

  async function validateCurrentOrg(currentOrg, orgId) {
    if (!currentOrg) {
      currentOrg = (await getOrgById(orgId)).data();
    }
    return currentOrg;
  }

  const checkExistingDeptName = (newName, deptId='', currentOrg) => {
    const orgDeptMap = currentOrg.departmentsMap || {};
    Object.keys(orgDeptMap).forEach((id) => {
      const dept = orgDeptMap[id];
      if (deptId !== id && dept.name.toLowerCase() === newName.toLowerCase()) {
          const err =  new Error('Department with same name already exists');
          err.name = "NameExists";
          throw err;
      }
    })
  }
  
  export const createDepartment = async (orgId, newData, currentOrg) => {
    currentOrg = await validateCurrentOrg(currentOrg, orgId);
    newData.createdAt = new Date()
    newData.updatedAt = new Date()
    checkExistingDeptName(newData.name, "", currentOrg);
    const batch = writeBatch(db);
    const docRef = doc(collection(db, 'orgs', orgId, 'departments'));
    batch.set(docRef, newData)
    let orgDeptMap = currentOrg.departmentsMap || {}
    orgDeptMap = {...orgDeptMap, [docRef.id]: newData}
    const orgDocRef = doc(db, 'orgs', orgId)
    batch.set(orgDocRef, {...currentOrg, departmentsMap: orgDeptMap});
    return batch.commit()
  };
  
  export const getDepartments = async (orgId, currentOrg) => {
    currentOrg = await validateCurrentOrg(currentOrg, orgId);
    return currentOrg.departmentsMap.values();
  };
  
  export const subscribeToDepartments = (orgId, callback) => {
    const q = query(collection(db, 'orgs', orgId, 'departments'));
    return onSnapshot(q, (snapshot) => {
      const departments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(departments);
    });
  };
  
  export const updateDepartment = async (orgId, deptId, updatedData, currentOrg) => {
    updatedData.updatedAt = new Date()
    currentOrg = await validateCurrentOrg(currentOrg, orgId);
    const orgDeptMap = currentOrg.departmentsMap;
    const department = orgDeptMap[deptId]
    if (department.name !== updatedData.name) {
        checkExistingDeptName(updatedData.name, deptId, currentOrg);
    } else {
        delete updatedData['name'];
    }
    const batch = writeBatch(db);
    const deptRef = doc(db, 'orgs', orgId, 'departments', deptId);
    batch.set(deptRef, {...updatedData}, {merge: true});
    orgDeptMap[deptId] = {...department, ...updatedData};
    const orgDocRef = doc(db, 'orgs', orgId);
    batch.set(orgDocRef, {...currentOrg, departmentsMap: orgDeptMap});
    return batch.commit();
  };
  
  export const removeDepartment = async (orgId, deptId, currentOrg) => {
    currentOrg = await validateCurrentOrg(currentOrg, orgId);
    const batch = writeBatch(db);
    const docRef = doc(db, 'orgs', orgId, 'departments', deptId);
    batch.delete(docRef)
    const orgDeptMap = currentOrg.departmentsMap
    delete orgDeptMap[deptId]
    const orgDocRef = doc(db, 'orgs', orgId)
    batch.set(orgDocRef, {...currentOrg, departmentsMap: orgDeptMap})
    return batch.commit()
  };
  