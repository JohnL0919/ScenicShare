import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
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
