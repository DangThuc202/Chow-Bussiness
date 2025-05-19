import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";
import { IUserCookie } from "@/types/auth";
import { auth } from "../../firebaseConfig";
import {
  deleteGoogleLoginCookies,
  setGoogleLoginCookies,
} from "@/auth/handleCookies";
import Cookies from "universal-cookie";

const cookies = new Cookies();
interface AuthContextType {
  userGoogleInfo: User | null;
  userEmail: User | null;
  signInWithGoogle: () => Promise<UserCredential>;
  signInAuth: (email: string, password: string) => Promise<UserCredential>;
  signUpAuth: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [userGoogleInfo, setUserGoogleInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserGoogleInfo(user);
      } else {
        setUserGoogleInfo(null);
        localStorage.clear();
        sessionStorage.clear();
        deleteGoogleLoginCookies();
      }
    });

    const unsubscribeToken = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();

        const userLoginCookies: IUserCookie = { idToken: token };
        setUserGoogleInfo(user);
        setGoogleLoginCookies(userLoginCookies);
      }
    });

    setLoading(false);

    return () => {
      unsubscribeAuth();
      unsubscribeToken();
    };
  }, []);

  const setAccessToken = async (userCredential: UserCredential) => {
    try {
      const token = await userCredential.user.getIdToken();
      const idToken: IUserCookie = { idToken: token };

      cookies.set("user_token", token, {
        path: "/",
        maxAge: 3600,
        secure: true,
      });

      setGoogleLoginCookies(idToken);
    } catch (error) {
      handleFirebaseError(error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(
        auth,
        new GoogleAuthProvider()
      );
      await setAccessToken(userCredential);
      return userCredential;
    } catch (error) {
      handleFirebaseError(error);
      throw error;
    }
  };

  const signInAuth = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential?.user;

      setUserEmail(user);

      await setAccessToken(userCredential);

      return userCredential;
    } catch (error) {
      handleFirebaseError(error);
      throw error;
    }
  };

  const signUpAuth = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      handleFirebaseError(error);
      throw error;
    }
  };

  const logOut = async () => {
    setUserGoogleInfo(null);
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    deleteGoogleLoginCookies();
  };

  const handleFirebaseError = (error: unknown) => {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("Email này đã được sử dụng.");
          break;
        case "auth/weak-password":
          toast.error("Mật khẩu quá yếu, vui lòng chọn mật khẩu mạnh hơn.");
          break;
        case "auth/invalid-email":
          toast.error("Email không hợp lệ, vui lòng kiểm tra lại.");
          break;
        case "auth/user-not-found":
          toast.error("Không tìm thấy người dùng với email này.");
          break;
        case "auth/wrong-password":
          toast.error("Sai mật khẩu, vui lòng thử lại.");
          break;
        case "auth/too-many-requests":
          toast.error(
            "Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau."
          );
          break;
        case "auth/operation-not-allowed":
          toast.error("Tài khoản đăng ký hiện đang bị vô hiệu hóa.");
          break;
        case "auth/missing-password":
          toast.error("Vui lòng nhập mật khẩu.");
          break;
        default:
          toast.error("Đăng nhập thất bại, vui lòng thử lại.");
      }
    } else {
      toast.error("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userGoogleInfo,
        userEmail,
        logOut,
        signInWithGoogle,
        signInAuth,
        signUpAuth,
      }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
