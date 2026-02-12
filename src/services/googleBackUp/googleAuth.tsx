// googleAuth.ts
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";


export interface GoogleUser {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}

/* =============================
   CONFIG
============================= */

export const configureGoogle = () => {
  GoogleSignin.configure({
    webClientId:
      "530790439354-l9qnqq89egi1olkj3c198shc7ga08s9r.apps.googleusercontent.com",

    offlineAccess: true,

    scopes: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/drive.appdata",
    ],

    forceCodeForRefreshToken: true,
  });
};

/* =============================
   SIGN IN
============================= */

export async function signInGoogle(): Promise<GoogleUser> {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const result = await GoogleSignin.signIn();

    if (!result?.data?.user?.email) {
      throw new Error("AUTH_FAILED");
    }

    return mapUser(result.data?.user);
  } catch (err: any) {
    normalizeAuthError(err);
    throw err;
  }
}

/* =============================
   SILENT LOGIN
============================= */

export async function signInSilently(): Promise<GoogleUser | null> {
  try {
    const result = await GoogleSignin.signInSilently();

    if (!result?.data?.user?.email) return null;

    return mapUser(result.data.user);
  } catch {
    return null;
  }
}

/* =============================
   SIGN OUT
============================= */

export async function signOutGoogle() {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch {}
}

/* =============================
   TOKENS
============================= */

export async function getFreshAccessToken(): Promise<string | null> {
  try {
    const tokens = await GoogleSignin.getTokens();

    if (tokens.accessToken) return tokens.accessToken;

    await GoogleSignin.signInSilently();

    const fresh = await GoogleSignin.getTokens();

    return fresh.accessToken ?? null;
  } catch {
    return null;
  }
}

/* =============================
   CURRENT USER
============================= */

export async function getCurrentUser(): Promise<GoogleUser | null> {
  try {
    const user = await GoogleSignin.getCurrentUser();

    if (user?.user?.email) {
      return mapUser(user.user);
    }

    const silent = await signInSilently();

    return silent;
  } catch {
    return null;
  }
}

/* =============================
   HELPERS
============================= */

function mapUser(user: any): GoogleUser {
  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email,
    photo: user.photo ?? null,
    familyName: user.familyName ?? null,
    givenName: user.givenName ?? null,
  };
}

function normalizeAuthError(err: any) {
  if (!err) return;

  switch (err.code) {
    case statusCodes.SIGN_IN_CANCELLED:
      err.code = "CANCELLED";
      break;

    case statusCodes.IN_PROGRESS:
      err.code = "IN_PROGRESS";
      break;

    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
      err.code = "NO_PLAY_SERVICES";
      break;

    default:
      if (!err.code) {
        err.code = "AUTH_ERROR";
      }
  }

  return err;
}