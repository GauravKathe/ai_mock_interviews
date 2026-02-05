import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
  const apps = getApps();

  if (!apps.length) {
    // Normalize env vars: strip surrounding quotes if present
    const rawProjectId = process.env.FIREBASE_PROJECT_ID;
    const rawClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

    const projectId = rawProjectId?.replace(/^"|"$/g, "");
    const clientEmail = rawClientEmail?.replace(/^"|"$/g, "");
    // Handle private key with literal "\\n" sequences or actual newlines
    const privateKey = rawPrivateKey
      ? rawPrivateKey.replace(/\\n/g, "\n").replace(/^"|"$/g, "")
      : undefined;

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}

export const { auth, db } = initFirebaseAdmin();
