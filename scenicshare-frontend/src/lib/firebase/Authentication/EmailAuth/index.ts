import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase/index";

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
    //sending email verification to the user
    sendEmailVerification(results);
    alert(
      `Thanks for signing up! Check ${email} (and your spam folder) to verify your account.`
    );
  } catch (error) {
    console.log(error);
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
      alert("Please verify your email address to continue.");
    } else {
      alert("Login successful");
    }
  } catch (error) {
    console.log(error);
  } finally {
    console.log("finally");
  }
};
