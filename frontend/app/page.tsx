import {redirect} from "next/navigation";
import {useAuth} from "@/context/authContext";

export default function Page() {
    // const {isAuthenticated} = useAuth();
    // return isAuthenticated ? redirect("/dashboard") : redirect("login")
    redirect("/dashboard")
}