import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase/index";
import {
  showFirebaseError,
  showSuccessMessage,
  showInfoMessage,
} from "@/lib/errorHandler";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const results = userCredential.user;
    console.log(results);
    await sendEmailVerification(results);
    showSuccessMessage(
      `Thanks for signing up! Check ${email} (and your spam folder) to verify your account.`
    );
    return true;
  } catch (error) {
    showFirebaseError(error);
    return false;
  } finally {
    setLoading(false);
  }
};

export const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    console.log(email, password);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const results = userCredential.user;
    if (results.emailVerified === false) {
      showInfoMessage("Please verify your email address to continue.");
    } else {
      showSuccessMessage("Login successful");
    }
  } catch (error) {
    showFirebaseError(error);
  } finally {
    console.log("finally");
  }
};
