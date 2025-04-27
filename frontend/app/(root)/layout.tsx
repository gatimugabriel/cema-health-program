import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layouts/app-sidebar"
import AppHeader from "@/components/layouts/app-header";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />

                {/* Main content area */}
                <div className=" flex-1 flex flex-col overflow-hidden">
                    {/* header */}
                    <AppHeader />

                    {/* main content */}
                    <main className="flex-1 overflow-y-auto p-4 @container/main">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}