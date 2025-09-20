"use client";
import BuilderNavbar from "@/components/pageComponents/builder/navbar";
import BuilderSidebar from "@/components/pageComponents/builder/sidebar";
import "@liveblocks/react-comments/styles.css";
import { Room } from "./room";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_dev_wyTZmgMKArQZjtI_bZ5RzrUzfmjhl2zKpzkzF_C51HZV6PBHAoCITCITxuJo1GNG"
      }
    >
      <RoomProvider id="my-room">
        <div className="h-screen w-screen overflow-hidden">
          {/* Navbar */}
          <div className="fixed top-0 left-0 right-0 h-[60px] z-20">
            <BuilderNavbar />
          </div>

          {/* Sidebar */}
          <div className="fixed top-[60px] left-0 w-[256px] h-[calc(100vh-60px)] z-10">
            <BuilderSidebar />
          </div>

          {/* Canvas Area */}
          <div className="fixed top-[60px] left-[300px] right-0 bottom-0 overflow-hidden bg-white dark:bg-gray-900">
            <Room>{children}</Room>
          </div>
        </div>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
