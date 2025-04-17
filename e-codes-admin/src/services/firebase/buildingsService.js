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

  const checkExistingBuildingName = (newName, buildingId='', currentOrg) => {
    const orgBuildMap = currentOrg.buildingsMap || {};
    Object.keys(orgBuildMap).forEach((id) => {
      const building = orgBuildMap[id];
      if (buildingId !== id && building.name.toLowerCase() === newName.toLowerCase()) {
          const err =  new Error('Building with same name already exists');
          err.name = "NameExists";
          throw err;
      }
    })
  }
  
  export const createBuilding = async (orgId, buildingData, currentOrg) => {
    currentOrg = await validateCurrentOrg(currentOrg, orgId);
    buildingData.createdAt = new Date()
    buildingData.updatedAt = new Date()
    checkExistingBuildingName(buildingData.name, "", currentOrg);
    const batch = writeBatch(db);
    const docRef = doc(collection(db, 'orgs', orgId, 'buildings'));
    batch.set(docRef, buildingData)
    let orgBuildMap = currentOrg.buildingsMap || {}
    //orgBuildMap[docRef.id] = buildingData
    orgBuildMap = {...orgBuildMap, [docRef.id]: buildingData}
    const orgDocRef = doc(db, 'orgs', orgId)
    batch.set(orgDocRef, {...currentOrg, buildingsMap: orgBuildMap});
    return batch.commit()
  };
  
  export const getBuildings = async (orgId, currentOrg) => {
    currentOrg = await validateCurrentOrg(currentOrg, orgId);
    return currentOrg.buildingsMap.values();
  };
  
  export const subscribeToBuildings = (orgId, callback) => {
    const q = query(collection(db, 'orgs', orgId, 'buildings'));
    return onSnapshot(q, (snapshot) => {
      const buildings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(buildings);
    });
  };
  
  export const updateBuilding = async (orgId, buildingId, updatedData, currentOrg) => {
    updatedData.updatedAt = new Date();
    currentOrg = await validateCurrentOrg(currentOrg, orgId);
    const orgBuildMap = currentOrg.buildingsMap;
    const building = orgBuildMap[buildingId]
    if (building.name !== updatedData.name) {
        checkExistingBuildingName(updatedData.name, buildingId, currentOrg);
    } else {
        delete updatedData['name'];
    }
    const batch = writeBatch(db);
    const buildingRef = doc(db, 'orgs', orgId, 'buildings', buildingId);
    batch.set(buildingRef, {...updatedData}, {merge: true});
    orgBuildMap[buildingId] = {...building, ...updatedData};
    const orgDocRef = doc(db, 'orgs', orgId);
    batch.set(orgDocRef, {...currentOrg, buildingsMap: orgBuildMap});
    return batch.commit();
  };
  
  export const removeBuilding = async (orgId, buildingId, currentOrg) => {
    currentOrg = await validateCurrentOrg(currentOrg, orgId);
    const batch = writeBatch(db);
    const docRef = doc(db, 'orgs', orgId, 'buildings', buildingId);
    batch.delete(docRef)
    const orgBuildMap = currentOrg.buildingsMap
    delete orgBuildMap[buildingId]
    const orgDocRef = doc(db, 'orgs', orgId)
    batch.set(orgDocRef, {...currentOrg, buildingsMap: orgBuildMap})
    return batch.commit()
  };
  