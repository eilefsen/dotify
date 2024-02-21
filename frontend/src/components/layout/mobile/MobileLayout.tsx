import {Outlet} from "react-router-dom";
import {LibraryFooter} from "./MobileFooter";
import {LibraryHeader} from "./LibraryHeader";

export default function Layout() {
    return (
        <>
            <LibraryHeader />
            <LibraryOutlet />
            <LibraryFooter />
        </>
    );
}

function LibraryOutlet() {
    return (
        <main className="content overflow-scroll pt-2 fixed top-12 left-0 bottom-20 right-0">
            <Outlet />
        </main>
    );
}
