"use client";
import BuilderNavbar from "@/components/pageComponents/builder/navbar";
import BuilderSubNavbar from "@/components/pageComponents/builder/subnavbar";
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
  const navHeight = 60;
  const toolsHeight = 46;
  const topOffset = navHeight + toolsHeight;
  const leftOffset = showSidebar ? 300 : 50;
  const rightOffset = 300;

  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_dev_wyTZmgMKArQZjtI_bZ5RzrUzfmjhl2zKpzkzF_C51HZV6PBHAoCITCITxuJo1GNG"
      }
    >
      <RoomProvider id="my-room">
        <div className="h-screen w-screen overflow-hidden">
          {/* Navbar */}
          <div className="fixed top-0 left-0 right-0 h-[60px] z-30">
            <BuilderNavbar />
          </div>

          {/* Tools Subnavbar */}
          <div className="fixed top-[60px] left-0 right-0 h-[46px] z-20">
            <BuilderSubNavbar />
          </div>

          {/* left Sidebar */}
          <div
            className="fixed left-0 z-10"
            style={{ top: `${topOffset}px`, height: `calc(100vh - ${topOffset}px)` }}
          >
            <BuilderLeftSidebar />
          </div>

          {/* Canvas Area */}
          <div
            className="fixed bottom-0 overflow-hidden"
            style={{
              top: `${topOffset}px`,
              left: `${leftOffset}px`,
              right: `${rightOffset}px`,
            }}
          >
            <Room>{children}</Room>
          </div>

          {/* Right Sidebar */}
          <div
            className="fixed right-0 z-10"
            style={{
              top: `${topOffset}px`,
              width: `${rightOffset}px`,
              height: `calc(100vh - ${topOffset}px)`,
            }}
          >
            <BuilderRightSidebar />
          </div>
        </div>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
