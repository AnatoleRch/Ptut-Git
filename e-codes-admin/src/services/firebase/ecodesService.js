import { 
    collection, 
    writeBatch, 
    doc,
    getDocFromServer,
    onSnapshot 
  } from 'firebase/firestore';
  import { db } from './firebaseInit';
  //import { getOrgById } from './orgService';

  async function validateCodesMap(codesMap, orgId) {
    if (!codesMap || Object.keys(codesMap).length === 0) {
      const docRef = doc(db, 'orgs', orgId, 'maps', 'ecodes');
      codesMap = (await getDocFromServer(docRef)).data()?.codesMap;
      console.log("Codes read from db")
    }
    return codesMap ? codesMap : {};
  }

  const checkExistingCodeName = (newName, codeId='', codesMap) => {
    Object.keys(codesMap).forEach((id) => {
      const code = codesMap[id];
      if (codeId !== id && code.name.toLowerCase() === newName.toLowerCase()) {
          const err =  new Error('Code with same name already exists');
          err.name = "NameExists";
          throw err;
      }
    })
  }
  
  export const createCode = async (orgId, newData, codesMap) => {
    codesMap = await validateCodesMap(codesMap, orgId);
    newData.createdAt = new Date()
    newData.updatedAt = new Date()
    checkExistingCodeName(newData.name, "", codesMap);
    const batch = writeBatch(db);
    const docRef = doc(collection(db, 'orgs', orgId, 'ecodes'));
    //batch.set(docRef, newData)
    codesMap = {...codesMap, [docRef.id]: newData}
    const codesDocRef = doc(db, 'orgs', orgId, 'maps', 'ecodes')
    batch.set(codesDocRef, { codesMap: codesMap });
    batch.commit()
    return { id: docRef.id, ...newData }
  };
  
  export const getCodes = (orgId, codesMap) => {
    return validateCodesMap(codesMap, orgId);
  };
  
  export const subscribeToCodes = (orgId, callback) => {
    const docRef = doc(db, 'orgs', orgId, 'maps', 'ecodes');
    return onSnapshot(docRef, (doc) => {
      const codesMap = doc.data()?.codesMap || {};
      const codes = Object.entries(codesMap).map(([codeId, code]) => ({ id: codeId, ...code }))
      callback(codes);
    });
  };
  
  export const updateCode = async (orgId, codeId, updatedData, codesMap) => {
    updatedData.updatedAt = new Date()
    codesMap = await validateCodesMap(codesMap, orgId);
    const code = codesMap[codeId]
    if (code.name !== updatedData.name) {
        checkExistingCodeName(updatedData.name, codeId, codesMap);
    }
    const batch = writeBatch(db);
    // const deptRef = doc(db, 'orgs', orgId, 'departments', codeId);
    // batch.set(deptRef, {...updatedData}, {merge: true});
    codesMap[codeId] = {...code, ...updatedData};
    const codesDocRef = doc(db, 'orgs', orgId, 'maps', 'ecodes')
    batch.set(codesDocRef, { codesMap: codesMap });
    return batch.commit();
  };
  
  export const removeCode = async (orgId, codeId, codesMap) => {
    codesMap = await validateCodesMap(codesMap, orgId);
    const batch = writeBatch(db);
    // const docRef = doc(db, 'orgs', orgId, 'departments', codeId);
    // batch.delete(docRef)
    delete codesMap[codeId];
    const codesDocRef = doc(db, 'orgs', orgId, 'maps', 'ecodes')
    batch.set(codesDocRef, { codesMap: codesMap });
    return batch.commit()
  };
  