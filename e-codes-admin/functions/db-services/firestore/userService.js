import { db } from "../../initialise-firebase.js";

export const getUserById = async (uid, orgId) => {
    const userRef = db.collection(`orgs/${orgId}/users`).doc(uid);
    return (await userRef.get()).data();
}

export const addUser = async (uid, orgId, userData) => {
    userData.createdAt = new Date();
    userData.updatedAt = new Date();
    const mapDoc = db.collection(`orgs/${orgId}/maps`).doc('departmentUsers');
    //try {
    await db.runTransaction(async (t) => {
        const departmentUsersMap = (await t.get(mapDoc)).data()?.departmentUsersMap || {};
        const userRef = db.collection(`orgs/${orgId}/users`).doc(uid);
        t.set(userRef, userData);
        const deptId = userData.department.id;
        const department = departmentUsersMap[deptId] || { ...userData.department };
        delete department.id;
        departmentUsersMap[deptId] = department;
        department.usersMap = { ...department?.usersMap, [uid]: userData };
        t.set(mapDoc, { departmentUsersMap });
    });
    // } catch (err) {
    //     throw new HttpsError('internal', err.message);
    // }
}

export const editUser = async (uid, orgId, userData) => {
    userData.updatedAt = new Date();
    const mapDoc = db.collection(`orgs/${orgId}/maps`).doc('departmentUsers');
    await db.runTransaction(async (t) => {
        const departmentUsersMap = (await t.get(mapDoc)).data()?.departmentUsersMap;
        const userRef = db.collection(`orgs/${orgId}/users`).doc(uid);
        t.update(userRef, userData);
        const existing = Object.values(departmentUsersMap).find(dept => uid in dept.usersMap)?.usersMap[uid];
        if (existing.department.id !== userData.department.id) {
            delete departmentUsersMap[existing.department.id].usersMap[uid];
        }
        const deptId = userData.department.id;
        const department = departmentUsersMap[deptId] || { ...userData.department };
        delete department.id;
        departmentUsersMap[deptId] = department;
        department.usersMap = { ...department?.usersMap, [uid]: userData };
        t.set(mapDoc, { departmentUsersMap });
    });
}

export const removeUser = async (uid, orgId) => {
    const mapDoc = db.collection(`orgs/${orgId}/maps`).doc('departmentUsers');
    await db.runTransaction(async (t) => {
        const departmentUsersMap = (await t.get(mapDoc)).data()?.departmentUsersMap;
        const userRef = db.collection(`orgs/${orgId}/users`).doc(uid);
        //t.delete(userRef);
        db.recursiveDelete(userRef);
        // check about recursive delete
        const existing = Object.values(departmentUsersMap).find(dept => uid in dept.usersMap)?.usersMap[uid];
        delete departmentUsersMap[existing.department.id].usersMap[uid];
        t.set(mapDoc, { departmentUsersMap });
    });
}