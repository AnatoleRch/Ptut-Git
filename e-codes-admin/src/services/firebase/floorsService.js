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

  const checkExistingFloorName = (newName, buildingId='', floorId='', currentOrg) => {
    const floorsMap = currentOrg.buildingsMap[buildingId].floorsMap || {};
    Object.keys(floorsMap).forEach((id) => {
      const floor = floorsMap[id];
      if (floorId !== id && floor.name.toLowerCase() === newName.toLowerCase()) {
          const err =  new Error('Floor with same name already exists');
          err.name = "NameExists";
          throw err;
      }
    })
  }
  
  export const createFloor = async (orgId, buildingId, newData, currentOrg) => {
    currentOrg = await validateCurrentOrg(currentOrg, orgId);
    newData.createdAt = new Date()
    newData.updatedAt = new Date()
    checkExistingFloorName(newData.name, buildingId, "", currentOrg);
    const batch = writeBatch(db);
    const docRef = doc(collection(db, 'orgs', orgId, 'buildings', buildingId, 'floors'));
    batch.set(docRef, newData)
    const orgBuildMap = currentOrg.buildingsMap;
    let floorsMap = orgBuildMap[buildingId].floorsMap || {};
    floorsMap = {...floorsMap, [docRef.id]: newData}
    orgBuildMap[buildingId].floorsMap = floorsMap;
    const orgDocRef = doc(db, 'orgs', orgId)
    batch.set(orgDocRef, {...currentOrg, buildingsMap: orgBuildMap});
    return batch.commit()
  };
  
  export const getFloors = async (orgId, buildingId, currentOrg) => {
    currentOrg = await validateCurrentOrg(currentOrg, orgId);
    return currentOrg.buildingsMap[buildingId].floorsMap.values();
  };
  
  export const subscribeToFloors = (orgId, buildingId, callback) => {
    const q = query(collection(db, 'orgs', orgId, 'buildings', buildingId, 'floors'));
    return onSnapshot(q, (snapshot) => {
      const floors = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(floors);
    });
  };
  
  export const updateFloor = async (orgId, buildingId, floorId, updatedData, currentOrg) => {
    updatedData.updatedAt = new Date();
    currentOrg = await validateCurrentOrg(currentOrg, orgId);
    const orgBuildMap = currentOrg.buildingsMap;
    const floor = orgBuildMap[buildingId].floorsMap[floorId];
    if (floor.name !== updatedData.name) {
        checkExistingFloorName(updatedData.name, buildingId, floorId, currentOrg);
    } else {
        delete updatedData['name'];
    }
    const batch = writeBatch(db);
    const floorRef = doc(db, 'orgs', currentOrg.id, 'buildings', buildingId, 'floors', floorId);
    batch.set(floorRef, {...updatedData}, {merge: true});
    orgBuildMap[buildingId].floorsMap[floorId] = {...floor, ...updatedData};
    const orgDocRef = doc(db, 'orgs', currentOrg.id);
    batch.set(orgDocRef, {...currentOrg, buildingsMap: orgBuildMap});
    return batch.commit();
  };
  
  export const removeFloor = async (orgId, buildingId, floorId, currentOrg) => {
    currentOrg = await validateCurrentOrg(currentOrg, orgId);
    const batch = writeBatch(db);
    const docRef = doc(db, 'orgs', orgId, 'buildings', buildingId, 'floors', floorId);
    batch.delete(docRef)
    const orgBuildMap = currentOrg.buildingsMap
    delete orgBuildMap[buildingId].floorsMap[floorId]
    const orgDocRef = doc(db, 'orgs', orgId)
    batch.set(orgDocRef, {...currentOrg, buildingsMap: orgBuildMap})
    return batch.commit()
  };
  