import {redirect} from "next/navigation";

export default function Page() {
    const isUserAuthenticated = true;
    return isUserAuthenticated ? redirect("/dashboard") : redirect("login")
}