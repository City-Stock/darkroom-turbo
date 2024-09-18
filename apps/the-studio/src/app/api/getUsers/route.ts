import { NextRequest, NextResponse } from "next/server";
import { applicationDefault } from "firebase-admin/app";
import { apps, auth, credential } from "firebase-admin";
import * as admin from "firebase-admin";
import { firebaseConfig } from "@/firebase/clientFirebaseInstance";

const init = async () => {
  const app = admin.apps.find((app) => app?.name === "api");

  if (!app) {
    try {
      admin.initializeApp(
        {
          credential: admin.credential.cert({
            type: "service_account",
            project_id: "citystock-darkroom-dev",
            private_key_id: "2a28a928a346bf291e6c55033a6ec33563798992",
            private_key:
              "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCzhsKRcqk/fxMX\nCh0Nnsc/VLRWPZLs+EAwG6VqFHAhkvhzbiu7bXvMFO9jVCqlYfx9dMG+/QUf/Y8r\n+BiTvbC0gIHd/CSwWPUrQNk11nhPQNZmnhlIRkzxxUWHvU3WVq5Px+4NLNymUSkS\nU16Pi4flBnykgJiBQ6KPFEhXNTCZrd+gBNojzZ2SUN3ckvAK/Z7TgeUUOn0BGFtt\n9kbPTs/NXAU2Y+W5XLnKgfZxTHXb90LKXnboxp0f1aGu3+E6/hE2WPeUU7oH01Jz\nkhTSi6mONuas4HgNOnPJQLhyGpFS4KXBVEKeLOxXk+PUSHErGbFYlf7JxD04Jmtn\ns8UFCyqhAgMBAAECgf9EpL+7TX8EFa/+8ecEpjQZNbzJR5Ho+fh7weu7EUWEEOY0\nJ2lL/njaInHGJmXdXAdnEOsOqUBPExdYq0GlJrVszxYuWD15uwnuF/BLHaOy6gpm\nAl2NvROpU3yv14+Y57E5itYC7lG6u52wsXVJUwNgbDKMfn8m2JhM4mcmsTfRX9OM\nPJEPuQYPosg8BoSoYAl3/P0bqmq0f//8hFcP5x9P4EvlH0TeNbKmboYLuU66/OJe\n4XI/+rvmnfoTT8vAv0UU2M9iRMYOhwJ8wZ3J145cse3OzJLy7IW5qjh069N/Jvu4\nwmS7zWxlmdYTIWfUjBSP7VoLgySJa2f0R2OeFoECgYEA38+A8J35zo23SZVvo354\nqHjFEDi1X3Oh+tUdqv+GokDYF0+cPDQRSUYEjRZznrJCOVpCkUo4shRyTipousAP\n39u/QV9Qn0rKuqcEiYuEYMz+v8cQxG+YW+N8JvW85d1VUza2sgOnJ12/wL0mCETk\nMkAeQSDPD1FtbEFuPtPGmYECgYEAzVjBSlqnURFsMbLXVtujiX4BZ2O2Flgl4jnx\nVfH2f6Q4dKSoHzwtHAzT6n1exJgOzSpwAs8awC2H/OZNXpg9b9V8mbv1GS3ZNR1X\nFkn/b6sfXNuuEPRaKnfmAC6LTA1Jxjd9arM8pdxsr6OvXFWClQMk9RAZqCW1W/73\njnkH4SECgYEAuQ2to0Y7wtnSbvkscZak1UfmSN9auC24BNopybW18HqFMeEVYYH7\nuQY3xSCHQPRLZXiICfHApx3Y1WCjb6ZWedYMcVUKKGuC7IokakX9krxs9sz1xDYx\nV+jkQqJ1Keq0HjXjIZV7pEUTw52h0LyFojb5zQf/rL67JwOC0FfyogECgYAaUQic\njdeplREHoYLld8qSoVputKGuZWedgY2DVTohC5vMnxmIvz6MvLwf7idKDK7A7nJi\necZU4MDv0VgTCnG9Nl/8l9EGhBC1NOhnS953ojenv+Oj+pzfmnQYi96ARaexxoTF\nOulH3GL1c4XS0IamsDt5SLHxEbwXaSqy0KII4QKBgQCtaXL8cREonTzgYBmidnl2\nu2fIHV36cYi+Tsttx0/yFG3MwVkOW/22m9J1fYom54bBp4NGJYZ0Zagqq/B/roHx\n8eXykZ9ouXObghVuT4yQuApCv+IlhqNhzeEFrDUm/6KqDA27+iU5pN6wMg3qb7t0\nvpkGlONhu1qeLIR9R+oZdQ==\n-----END PRIVATE KEY-----\n".replace(
                /\\n/g,
                "\n"
              ),
            client_email:
              "firebase-adminsdk-b4gr5@citystock-darkroom-dev.iam.gserviceaccount.com",
            client_id: "103888086420775431726",
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url:
              "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url:
              "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-b4gr5%40citystock-darkroom-dev.iam.gserviceaccount.com",
            universe_domain: "googleapis.com",
          } as admin.ServiceAccount),
          projectId: "citystock-darkroom-dev",
        },
        "api"
      );
    } catch (error) {
      console.log(error);
    }
  }
};

init();
export async function GET(request: NextRequest, response: NextResponse) {
  const app = admin.app("api");
  try {
    let nextPageToken;
    let allUsers: any[] = [];

    do {
      const { users, pageToken } = await app
        .auth()
        .listUsers(1000, nextPageToken);
      nextPageToken = pageToken;
      allUsers.push(...users);
    } while (nextPageToken);
    return NextResponse.json(allUsers, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
