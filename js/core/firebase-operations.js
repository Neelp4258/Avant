/* ===================================
   Firebase CRUD Operations Helpers
   ================================ */

import { db } from './firebase-config.js';
import { 
    collection, addDoc, updateDoc, deleteDoc, doc, 
    getDocs, getDoc, query, orderBy, where 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Create document
export async function createDocument(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        console.log(`✅ Created document in ${collectionName}:`, docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error(`❌ Error creating document in ${collectionName}:`, error);
        return { success: false, error: error.message };
    }
}

// Read all documents from collection
export async function readAllDocuments(collectionName) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        console.log(`✅ Read ${documents.length} documents from ${collectionName}`);
        return { success: true, data: documents };
    } catch (error) {
        console.error(`❌ Error reading documents from ${collectionName}:`, error);
        return { success: false, error: error.message, data: [] };
    }
}

// Read single document
export async function readDocument(collectionName, documentId) {
    try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        } else {
            return { success: false, error: 'Document not found' };
        }
    } catch (error) {
        console.error(`❌ Error reading document from ${collectionName}:`, error);
        return { success: false, error: error.message };
    }
}

// Update document
export async function updateDocument(collectionName, documentId, data) {
    try {
        const docRef = doc(db, collectionName, documentId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString()
        });
        console.log(`✅ Updated document in ${collectionName}:`, documentId);
        return { success: true };
    } catch (error) {
        console.error(`❌ Error updating document in ${collectionName}:`, error);
        return { success: false, error: error.message };
    }
}

// Delete document
export async function deleteDocument(collectionName, documentId) {
    try {
        await deleteDoc(doc(db, collectionName, documentId));
        console.log(`✅ Deleted document from ${collectionName}:`, documentId);
        return { success: true };
    } catch (error) {
        console.error(`❌ Error deleting document from ${collectionName}:`, error);
        return { success: false, error: error.message };
    }
}

// Query documents with conditions
export async function queryDocuments(collectionName, conditions = [], orderByField = null, orderDirection = 'asc') {
    try {
        let q = collection(db, collectionName);
        
        // Apply where conditions
        if (conditions.length > 0) {
            const constraints = conditions.map(c => where(c.field, c.operator, c.value));
            q = query(q, ...constraints);
        }
        
        // Apply ordering
        if (orderByField) {
            q = query(q, orderBy(orderByField, orderDirection));
        }
        
        const querySnapshot = await getDocs(q);
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, data: documents };
    } catch (error) {
        console.error(`❌ Error querying documents from ${collectionName}:`, error);
        return { success: false, error: error.message, data: [] };
    }
}
