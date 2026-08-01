import React from "react";
import "@fontsource/google-sans/400.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({ children} :{ children:React.ReactNode}){
    return(
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 flex font-google">
            <Sidebar/>
            <div className= "flex-1 ml-[260px] flex flex-col">
                <Navbar/>
                
                <main className="p-8">
                    {children}

                </main>
            </div>
        </div>
       
    );
}