import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  showFirebaseError,
  showSuccessMessage,
  showErrorMessage,
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
    console.log("successfully logged in as", email);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const results = userCredential.user;

    if (!results.emailVerified) {
      // Sign them out immediately - no access until verified
      await auth.signOut();
      showErrorMessage(
        "Please verify your email before logging in. Check your inbox (and spam folder)."
      );
      return null;
    }

    showSuccessMessage("Login successful");
    return results;
  } catch (error) {
    showFirebaseError(error);
    return null;
  } finally {
    console.log("finally");
  }
};
