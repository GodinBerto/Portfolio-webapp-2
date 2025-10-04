"use client";
import BuilderNavbar from "@/components/pageComponents/builder/navbar";
import "@liveblocks/react-comments/styles.css";
import { Room } from "../../components/pageComponents/builder/room";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import BuilderLeftSidebar from "@/components/pageComponents/builder/leftsidebar";
import BuilderRightSidebar from "@/components/pageComponents/builder/rigthsidebar";
import { useSelector } from "react-redux";

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showSidebar = useSelector((state: any) => state.sidebar.showSidebar);

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

          {/* left Sidebar */}
          <div className="fixed top-[60px] left-0  h-[calc(100vh-60px)] z-10">
            <BuilderLeftSidebar />
          </div>

          {/* Canvas Area */}
          <div className={`fixed top-[60px]  bottom-0 overflow-hidden `}>
            <Room>{children}</Room>
          </div>

          {/* left Sidebar */}
          <div className="fixed top-[60px] right-0 w-[300px] h-[calc(100vh-60px)] z-10">
            <BuilderRightSidebar />
          </div>
        </div>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
