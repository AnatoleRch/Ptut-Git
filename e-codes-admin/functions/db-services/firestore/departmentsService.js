import { db } from "../../initialise-firebase.js";

export const getDepartmentById = async (orgId, deptId) => {
    const doc = await db.collection(`orgs/${orgId}/departments`).doc(deptId).get();
    return doc.data();
}

export const getDepartmentUsersMap = (orgId) => {
    let departmentUsersMap = {};
    db.collection(`orgs/${orgId}/maps`).doc('departmentUsers').get().then(doc => {
        departmentUsersMap = doc.exists ? doc.data().departmentUsersMap : {}
    })
    return departmentUsersMap;
}