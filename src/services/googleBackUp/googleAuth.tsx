// googleAuth.ts
import { GoogleSignin, statusCodes, User } from '@react-native-google-signin/google-signin';
import { Platform, Alert } from 'react-native';

export interface AuthResult {
  type: "success";
  data: {
    user: {
      id: string;
      name: string | null;
      email: string;
      photo: string | null;
      familyName: string | null;
      givenName: string | null;
    };
    scopes: string[];
    idToken: string | null;
    serverAuthCode: string | null;
    accessToken: string | null;
  };
}

export const configureGoogle = () => {
  GoogleSignin.configure({
    webClientId:"530790439354-l9qnqq89egi1olkj3c198shc7ga08s9r.apps.googleusercontent.com",
    offlineAccess: true,
    scopes: ['profile', 'email', 'https://www.googleapis.com/auth/drive.appdata'],
    forceCodeForRefreshToken: true,
  });
};

export const signInGoogle = async (): Promise<AuthResult> => {

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const result = await GoogleSignin.signIn(); 

    if (!result.data?.user?.email) {
      throw new Error("Google signin failed");
    }

    const tokens = await GoogleSignin.getTokens();

    return {
      type: "success",
      data: {
        user: result.data.user,
        scopes: result.data.scopes,
        idToken: tokens.idToken ?? result.data.idToken ?? null,
        serverAuthCode: result.data.serverAuthCode,
        accessToken: tokens.accessToken ?? null
      }
    };

  } catch (err: any) {
    console.error("Google sign-in error:", err);
    console.log('ПОЛНАЯ ОШИБКА GOOGLE SIGNIN:', err);
    console.log('error.code:', err.code);
    console.log('error.message:', err.message);
    Alert.alert(JSON.stringify(err, null, 2));
    throw err;
  }
};

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (e) {
  }
};

export async function getFreshAccessToken() {
  try {
    const { accessToken } = await GoogleSignin.getTokens();
    if (accessToken) return accessToken;
    await GoogleSignin.signInSilently();
    const tokens = await GoogleSignin.getTokens();
    return tokens.accessToken;
  } catch {
    await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    return tokens.accessToken;
  }
}