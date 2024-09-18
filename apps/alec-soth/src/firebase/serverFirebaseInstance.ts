import {
  ServiceAccount,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import admin from "firebase-admin";

export const adminInitialize = () => {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        type: process.env.FIREBASE_ADMIN_TYPE,
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_ADMIN_CLIENT_ID,
        authUri: process.env.FIREBASE_ADMIN_AUTH_URI,
        tokenUri: process.env.FIREBASE_ADMIN_TOKEN_URI,
        authProviderX509CertUrl:
          process.env.FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL,
        clientX509CertUrl: process.env.FIREBASE_ADMIN_CLIENT_CERT_URL,
        universeDomain: process.env.FIREBASE_ADMIN_UNIVERSE_DOMAIN,
      } as ServiceAccount),
    });
  }
};
