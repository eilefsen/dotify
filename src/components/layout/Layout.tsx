import {Outlet} from "react-router-dom";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function Layout() {
    return (
        <>
            <Footer />
            <main className="content px-6 pt-2 fixed top-0 left-52 bottom-20 right-0">
                <Outlet />
            </main>
            <Sidebar />
        </>
    );
}
