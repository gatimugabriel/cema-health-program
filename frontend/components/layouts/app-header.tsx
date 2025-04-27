"use client"

import React from 'react'
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {SidebarTrigger} from "@/components/ui/sidebar"
import {SearchIcon} from "lucide-react";

export default function AppHeader() {
    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1"/>
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">DOCTOR</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button
                        variant="ghost"
                        asChild
                        size="sm"
                        className="flex sm:flex cursor-pointer hover:bg-transparent hover:text-xl"
                        onClick={() => {
                            window.alert("search feature coming soon")
                        }}
                    >
                        <div>
                            <SearchIcon/>
                            <span className="sr-only">Search</span>
                        </div>
                    </Button>
                </div>
            </div>
        </header>
    )
}