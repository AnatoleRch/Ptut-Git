import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getAuth } from '../initialise-firebase.js';
import { addUser, editUser, removeUser } from '../db-services/firestore/userService.js';
import { getDepartmentById } from '../db-services/firestore/departmentsService.js';

function verifyAccess(req) {
    if (!req.auth?.token || !(req.auth.token?.roles.OrgAdmin || req.auth.token?.roles.SuperAdmin)
        || (!req.auth.token?.roles.SuperAdmin && req.auth.token?.orgId !== req.data?.orgId)
    ) {
        throw new HttpsError('failed-precondition', 'Access not granted');
    }
}

async function validateDepartment(department, orgId) {
    if (!department || !department.id || !department.name) {
        throw new HttpsError('invalid-argument', 'department cannot be blank/empty for users');
    }
    const existing = await getDepartmentById(orgId, department.id);
    if (!existing || existing.name !== department.name) {
        throw new HttpsError('invalid-argument', 'Invalid department or department does not exist');
    }
}

function validateUserData(req, extraFields=[]) {
    ['orgId', 'email', 'firstName', 'lastName', 'role'].concat(extraFields).forEach((field) => {
        if (!req.data?.[field]?.trim()) {
            throw new HttpsError('invalid-argument', `${field} cannot be blank`);
        }
        if (field === "email") {
            if (!req.data.email.match(/^[0-9a-z]+(?:\.[0-9a-z]+)*@[a-z0-9]{1,}(?:\.[a-z]{2,})+$/)) {
                throw new HttpsError('invalid-argument', 'Invalid email address');
            }
        }
    })
    if (!["Admin", "RotaAdmin", "User"].includes(req.data.role)) {
        throw new HttpsError('invalid-argument', 'Invalid user role');
    }
    return validateDepartment(req.data.department, req.data.orgId);
}

export const createUser = onCall(async (req) => {
    verifyAccess(req);
    await validateUserData(req);
    const userData = { email: req.data.email, emailVerified: false };
    if (req.data.phoneNumber) {
        userData.phoneNumber = req.data.phoneNumber;
    }
    try {
        const newUser = await getAuth().createUser(userData);
        const customClaims = { orgId: req.data.orgId };
        customClaims.roles = req.data.role === "Admin" ? { OrgAdmin: true } : { [req.data.role]: true };
        await getAuth().setCustomUserClaims(newUser.uid, customClaims);
        await addUser(newUser.uid, req.data.orgId, req.data);
    } catch (err) {
        throw new HttpsError('internal', err.message);
    }
})

export const updateUser = onCall(async (req) => {
    verifyAccess(req);
    await validateUserData(req, ['id']);
    const existing = await getAuth().getUser(req.data.id);
    if (!existing) {
        throw new HttpsError('invalid-argument', 'Invalid user id');
    } else if (existing.email !== req.data.email) {
        throw new HttpsError('unimplemented', 'Changing email for users is not supported yet');
    }
    try {
        if (req.data.phoneNumber && req.data.phoneNumber !== existing.phoneNumber) {
            await getAuth().updateUser(req.data.id, { phoneNumber: req.data.phoneNumber });
        }
        const updRole = req.data.role === "Admin" ? "OrgAdmin" : req.data.role;
        if (!existing.customClaims.roles[updRole]) {
            const customClaims = { ...existing.customClaims, roles: { [updRole]: true } };
            await getAuth().setCustomUserClaims(existing.uid, customClaims);
        }
        await editUser(req.data.id, req.data.orgId, req.data);
    } catch (err) {
        throw new HttpsError('internal', err.message);
    }
})

export const deleteUser = onCall(async (req) => {
    verifyAccess(req);
    if (!req.data?.id?.trim()) {
        throw new HttpsError('invalid-argument', `Invalid user id`);
    }
    const existing = await getAuth().getUser(req.data.id);
    if (!existing) {
        throw new HttpsError('invalid-argument', 'Invalid user id');
    }
    try {
        await getAuth().deleteUser(req.data.id);
        await removeUser(req.data.id, req.data.orgId);
    } catch (err) {
        throw new HttpsError('internal', err.message);
    }
})