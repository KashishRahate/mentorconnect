// "use client";

// import React, { useState, useEffect, useContext } from "react";
// import { useRef } from "react";

// interface JitsiMeetingProps {
//   roomName: string;
//   userName: string;
//   userEmail: string;
//   onReady?: () => void;
//   onConferenceJoined?: () => void;
//   onConferenceLeft?: () => void;
// }

// declare global {
//   interface Window {
//     JitsiMeetExternalAPI: any;
//   }
// }

// const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
//   roomName,
//   userName,
//   userEmail,
//   onReady,
//   onConferenceJoined,
//   onConferenceLeft,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const jitsiApiRef = useRef<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Load Jitsi script
//     const script = document.createElement("script");
//     script.src = "https://meet.jit.si/external_api.js";
//     script.async = true;
//     script.onload = () => {
//       if (onReady) onReady();
//       initializeJitsi();
//     };
//     document.body.appendChild(script);

//     return () => {
//       if (jitsiApiRef.current) {
//         jitsiApiRef.current.dispose();
//       }
//     };
//   }, [onReady]);

//   const initializeJitsi = () => {
//     if (!containerRef.current || !window.JitsiMeetExternalAPI) return;

//     const options = {
//       roomName: roomName,
//       width: "100%",
//       height: "100%",
//       parentNode: containerRef.current,
//       userInfo: {
//         displayName: userName,
//         email: userEmail,
//       },
//       configOverwrite: {
//         startAudioOnly: false,
//         disableAudioLevels: false,
//         enableWelcomePage: false,
//         enableClosePage: false,
//       },
//       interfaceConfigOverwrite: {
//         DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
//         SHOW_JITSI_WATERMARK: false,
//         MOBILE_APP_PROMO: false,
//       },
//     };

//     try {
//       jitsiApiRef.current = new window.JitsiMeetExternalAPI(
//         "meet.jit.si",
//         options
//       );

//       jitsiApiRef.current.addEventListener("videoConferenceJoined", () => {
//         setIsLoading(false);
//         if (onConferenceJoined) onConferenceJoined();
//       });

//       jitsiApiRef.current.addEventListener("videoConferenceLeft", () => {
//         if (onConferenceLeft) onConferenceLeft();
//       });
//     } catch (error) {
//       console.error("Failed to initialize Jitsi:", error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-full">
//       {isLoading && (
//         <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-50">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//             <p className="text-white text-lg">
//               Connecting to video conference...
//             </p>
//           </div>
//         </div>
//       )}
//       <div ref={containerRef} className="w-full h-full" />
//     </div>
//   );
// };

// export default JitsiMeeting;

// "use client";

// import React, { useState, useEffect, useRef } from "react";

// interface JitsiMeetingProps {
//   roomName: string;
//   userName: string;
//   userEmail: string;
//   onReady?: () => void;
//   onConferenceJoined?: () => void;
//   onConferenceLeft?: () => void;
// }

// declare global {
//   interface Window {
//     JitsiMeetExternalAPI: any;
//   }
// }

// const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
//   roomName,
//   userName,
//   userEmail,
//   onReady,
//   onConferenceJoined,
//   onConferenceLeft,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const jitsiApiRef = useRef<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Avoid loading script multiple times
//     if (!document.getElementById("jitsi-script")) {
//       const script = document.createElement("script");
//       script.id = "jitsi-script";
//       // script.src = "https://meet.jit.si/external_api.js";
//       script.src = "https://8x8.vc/external_api.js";

//       script.async = true;
//       script.onload = () => {
//         if (onReady) onReady();
//         initializeJitsi();
//       };
//       script.onerror = () => {
//         setError("Failed to load Jitsi script. Please check your network.");
//         setIsLoading(false);
//       };
//       document.body.appendChild(script);
//     } else {
//       initializeJitsi();
//     }

//     return () => {
//       if (jitsiApiRef.current) {
//         jitsiApiRef.current.dispose();
//       }
//     };
//   }, [roomName]);

//   const initializeJitsi = () => {
//     if (!containerRef.current || !window.JitsiMeetExternalAPI) return;

//     const domain = "meet.jit.si";
//     const options = {
//       roomName,
//       parentNode: containerRef.current,
//       width: "100%",
//       height: "100%",
//       userInfo: {
//         displayName: userName,
//         email: userEmail,
//       },
//       configOverwrite: {
//         prejoinPageEnabled: true, // allow user to check audio/video before joining
//         startWithAudioMuted: false,
//         startWithVideoMuted: false,
//         disableDeepLinking: true, // prevent redirect to mobile app
//         enableClosePage: true,
//         disableInviteFunctions: true,
//       },
//       interfaceConfigOverwrite: {
//         SHOW_JITSI_WATERMARK: false,
//         MOBILE_APP_PROMO: false,
//         TOOLBAR_BUTTONS: [
//           "microphone",
//           "camera",
//           "desktop",
//           "fullscreen",
//           "chat",
//           "raisehand",
//           "tileview",
//           "hangup",
//         ],
//       },
//     };

//     try {
//       jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

//       jitsiApiRef.current.addEventListener("videoConferenceJoined", () => {
//         setIsLoading(false);
//         if (onConferenceJoined) onConferenceJoined();
//       });

//       jitsiApiRef.current.addEventListener("videoConferenceLeft", () => {
//         if (onConferenceLeft) onConferenceLeft();
//       });

//       jitsiApiRef.current.addEventListener("errorOccurred", (err: any) => {
//         console.error("Jitsi error:", err);
//         setError("Error initializing Jitsi meeting.");
//         setIsLoading(false);
//       });
//     } catch (err) {
//       console.error("Jitsi initialization failed:", err);
//       setError("Unable to start the Jitsi meeting.");
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-full">
//       {isLoading && !error && (
//         <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-50">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//             <p className="text-white text-lg">
//               Connecting to video conference...
//             </p>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-50">
//           <div className="text-center text-red-400">
//             <p className="mb-2">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       )}

//       {/* <div ref={containerRef} className="w-full h-full" /> */}
//       <div
//         ref={containerRef}
//         className="w-full h-[80vh] bg-black rounded-lg overflow-hidden"
//       />
//     </div>
//   );
// };

// export default JitsiMeeting;

// "use client";

// import React, { useEffect, useRef, useState } from "react";

// interface JitsiMeetingProps {
//   roomName: string;
//   userName: string;
//   userEmail: string;
//   onReady?: () => void;
//   onConferenceJoined?: () => void;
//   onConferenceLeft?: () => void;
// }

// declare global {
//   interface Window {
//     JitsiMeetExternalAPI: any;
//   }
// }

// const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
//   roomName,
//   userName,
//   userEmail,
//   onReady,
//   onConferenceJoined,
//   onConferenceLeft,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const jitsiApiRef = useRef<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // ✅ Step 1: Load Jitsi script
//     const script = document.createElement("script");
//     script.src = "https://8x8.vc/external_api.js"; // ✅ More stable Jitsi mirror
//     script.async = true;
//     script.onload = () => {
//       console.log("✅ Jitsi API loaded");
//       if (onReady) onReady();
//       initializeJitsi();
//     };
//     script.onerror = () => {
//       console.error("❌ Failed to load Jitsi API script");
//       setIsLoading(false);
//     };
//     document.body.appendChild(script);

//     // Cleanup on unmount
//     return () => {
//       if (jitsiApiRef.current) {
//         jitsiApiRef.current.dispose();
//         jitsiApiRef.current = null;
//       }
//     };
//   }, [roomName]);

//   const initializeJitsi = () => {
//     if (
//       !containerRef.current ||
//       typeof window.JitsiMeetExternalAPI === "undefined"
//     ) {
//       console.warn("⚠️ Jitsi API not available yet, retrying...");
//       setTimeout(initializeJitsi, 1500); // retry after 1.5s
//       return;
//     }

//     const options = {
//       roomName: roomName,
//       width: "100%",
//       height: "100%",
//       parentNode: containerRef.current,
//       userInfo: {
//         displayName: userName || "User",
//         email: userEmail || "",
//       },
//       configOverwrite: {
//         startWithAudioMuted: false,
//         startWithVideoMuted: false,
//         enableWelcomePage: false,
//         prejoinPageEnabled: false,
//       },
//       interfaceConfigOverwrite: {
//         DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
//         SHOW_JITSI_WATERMARK: false,
//         MOBILE_APP_PROMO: false,
//       },
//     };

//     try {
//       // ✅ Initialize API
//       jitsiApiRef.current = new window.JitsiMeetExternalAPI("8x8.vc", options);
//       console.log("🎥 Jitsi meeting initialized for room:", roomName);

//       jitsiApiRef.current.addEventListener("videoConferenceJoined", () => {
//         console.log("✅ Joined conference");
//         setIsLoading(false);
//         if (onConferenceJoined) onConferenceJoined();
//       });

//       jitsiApiRef.current.addEventListener("videoConferenceLeft", () => {
//         console.log("👋 Left conference");
//         if (onConferenceLeft) onConferenceLeft();
//       });
//     } catch (error) {
//       console.error("❌ Failed to initialize Jitsi:", error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-[80vh] bg-black rounded-lg overflow-hidden">
//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
//           <p className="text-white text-lg">
//             Connecting to video conference...
//           </p>
//         </div>
//       )}

//       {/* Jitsi Video Container */}
//       <div ref={containerRef} className="w-full h-full" />
//     </div>
//   );
// };

// export default JitsiMeeting;

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { useAuth } from "../context/AuthContext";

// declare global {
//   interface Window {
//     JitsiMeetExternalAPI: any;
//   }
// }

// interface JitsiMeetingProps {
//   roomName: string;
//   userName: string;
//   userEmail: string;
//   onReady?: () => void;
//   onConferenceJoined?: () => void;
//   onConferenceLeft?: () => void;
// }

// const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
//   roomName,
//   userName,
//   userEmail,
//   onReady,
//   onConferenceJoined,
//   onConferenceLeft,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const jitsiApiRef = useRef<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { user } = useAuth();

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://8x8.vc/external_api.js"; // ✅ stable Jitsi mirror
//     script.async = true;
//     script.onload = () => {
//       if (onReady) onReady();
//       initializeJitsi();
//     };
//     script.onerror = () => {
//       console.error("❌ Failed to load Jitsi API script");
//       setIsLoading(false);
//     };
//     document.body.appendChild(script);

//     return () => {
//       if (jitsiApiRef.current) {
//         jitsiApiRef.current.dispose();
//         jitsiApiRef.current = null;
//       }
//     };
//   }, [roomName]);

//   const initializeJitsi = () => {
//     if (!containerRef.current || !window.JitsiMeetExternalAPI) return;

//     const domain = "8x8.vc";
//     const options = {
//       roomName,
//       width: "100%",
//       height: "100%",
//       parentNode: containerRef.current,
//       userInfo: {
//         displayName: userName,
//         email: userEmail,
//       },
//       configOverwrite: {
//         startWithAudioMuted: false,
//         startWithVideoMuted: false,
//         prejoinPageEnabled: false,
//         enableWelcomePage: false,
//       },
//       interfaceConfigOverwrite: {
//         SHOW_JITSI_WATERMARK: false,
//         MOBILE_APP_PROMO: false,
//       },
//     };

//     const api = new window.JitsiMeetExternalAPI(domain, options);
//     jitsiApiRef.current = api;

//     api.addEventListener("videoConferenceJoined", () => {
//       console.log(`${userName} joined`);
//       setIsLoading(false);
//       if (onConferenceJoined) onConferenceJoined();

//       // ✅ Force mentor to moderator role
//       if (user?.role === "mentor") {
//         console.log("👨‍🏫 Mentor joined as moderator");
//         api.executeCommand("password", "mentorsecure123");
//       }
//     });

//     api.addEventListener("participantRoleChanged", (event: any) => {
//       if (event.role === "moderator") {
//         console.log("✅ Mentor is moderator");
//       }
//     });

//     api.addEventListener("videoConferenceLeft", () => {
//       console.log("👋 Conference ended");
//       if (onConferenceLeft) onConferenceLeft();
//     });
//   };

//   return (
//     <div className="relative w-full h-[80vh] bg-black rounded-lg overflow-hidden">
//       {isLoading && (
//         <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
//           <p className="text-white text-lg">
//             Connecting to video conference...
//           </p>
//         </div>
//       )}
//       <div ref={containerRef} className="w-full h-full" />
//     </div>
//   );
// };

// export default JitsiMeeting;

// "use client";

// import React, { useEffect, useRef, useState } from "react";

// interface JitsiMeetingProps {
//   roomName: string;
//   userName: string;
//   userEmail: string;
//   onReady?: () => void;
//   onConferenceJoined?: () => void;
//   onConferenceLeft?: () => void;
// }

// declare global {
//   interface Window {
//     JitsiMeetExternalAPI: any;
//   }
// }

// const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
//   roomName,
//   userName,
//   userEmail,
//   onReady,
//   onConferenceJoined,
//   onConferenceLeft,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const jitsiApiRef = useRef<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // ✅ Step 1: Dynamically load the Jitsi API script
//     const script = document.createElement("script");
//     script.src = "https://8x8.vc/external_api.js"; // stable mirror
//     script.async = true;
//     script.onload = () => {
//       console.log("✅ Jitsi API loaded successfully");
//       if (onReady) onReady();
//       initializeJitsi();
//     };
//     script.onerror = () => {
//       console.error("❌ Failed to load Jitsi API script");
//       setIsLoading(false);
//     };
//     document.body.appendChild(script);

//     // ✅ Cleanup when component unmounts
//     return () => {
//       if (jitsiApiRef.current) {
//         jitsiApiRef.current.dispose();
//         jitsiApiRef.current = null;
//       }
//     };
//   }, [roomName]);

//   // ✅ Step 2: Initialize Jitsi meeting
//   const initializeJitsi = () => {
//     if (
//       !containerRef.current ||
//       typeof window.JitsiMeetExternalAPI === "undefined"
//     ) {
//       console.warn("⚠️ Jitsi API not yet available, retrying...");
//       setTimeout(initializeJitsi, 1200); // retry
//       return;
//     }

//     // ✅ Setup meeting options
//     const domain = "8x8.vc"; // free Jitsi cluster
//     const options = {
//       roomName: roomName,
//       width: "100%",
//       height: "100%",
//       parentNode: containerRef.current,
//       userInfo: {
//         displayName: userName || "User",
//         email: userEmail || "",
//       },
//       configOverwrite: {
//         startWithAudioMuted: false,
//         startWithVideoMuted: false,
//         prejoinPageEnabled: false, // skip prejoin lobby
//         disableDeepLinking: true,
//         requireDisplayName: true,
//         enableWelcomePage: false,
//         enableClosePage: true,
//         toolbarButtons: [
//           "microphone",
//           "camera",
//           "chat",
//           "desktop",
//           "fullscreen",
//           "hangup",
//           "participants-pane",
//           "settings",
//           "tileview",
//           "toggle-camera",
//           "recording",
//         ],
//       },
//       interfaceConfigOverwrite: {
//         SHOW_JITSI_WATERMARK: false,
//         MOBILE_APP_PROMO: false,
//         DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
//         SHOW_CHROME_EXTENSION_BANNER: false,
//       },
//     };

//     try {
//       jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

//       // ✅ Once joined, stop the loader
//       jitsiApiRef.current.addEventListener("videoConferenceJoined", () => {
//         console.log("🎥 Joined conference successfully");
//         setIsLoading(false);
//         if (onConferenceJoined) onConferenceJoined();
//       });

//       // ✅ On conference leave
//       jitsiApiRef.current.addEventListener("videoConferenceLeft", () => {
//         console.log("👋 Left conference");
//         if (onConferenceLeft) onConferenceLeft();
//       });
//     } catch (error) {
//       console.error("❌ Failed to initialize Jitsi:", error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-[80vh] bg-black rounded-lg overflow-hidden">
//       {/* Loader Overlay */}
//       {isLoading && (
//         <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
//           <p className="text-white text-lg">
//             Connecting to video conference...
//           </p>
//         </div>
//       )}

//       {/* Jitsi iframe container */}
//       <div ref={containerRef} className="w-full h-full" />
//     </div>
//   );
// };

// export default JitsiMeeting;

// "use client";

// import React, { useEffect, useRef, useState } from "react";

// interface JitsiMeetingProps {
//   roomName: string;
//   userName: string;
//   userEmail: string;
//   onReady?: () => void;
//   onConferenceJoined?: () => void;
//   onConferenceLeft?: () => void;
// }

// declare global {
//   interface Window {
//     JitsiMeetExternalAPI: any;
//   }
// }

// const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
//   roomName,
//   userName,
//   userEmail,
//   onReady,
//   onConferenceJoined,
//   onConferenceLeft,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const jitsiApiRef = useRef<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://8x8.vc/external_api.js";
//     script.async = true;
//     script.onload = () => {
//       console.log("✅ Jitsi API loaded");
//       if (onReady) onReady();
//       initializeJitsi();
//     };
//     script.onerror = () => {
//       console.error("❌ Failed to load Jitsi API script");
//       setIsLoading(false);
//     };
//     document.body.appendChild(script);

//     return () => {
//       if (jitsiApiRef.current) {
//         jitsiApiRef.current.dispose();
//         jitsiApiRef.current = null;
//       }
//     };
//   }, [roomName]);

//   const initializeJitsi = () => {
//     if (
//       !containerRef.current ||
//       typeof window.JitsiMeetExternalAPI === "undefined"
//     ) {
//       console.warn("⚠️ Jitsi API not available yet, retrying...");
//       setTimeout(initializeJitsi, 1500);
//       return;
//     }

//     const domain = "8x8.vc";
//     const roomPath = `${domain}/${roomName}`;

//     const options = {
//       roomName,
//       parentNode: containerRef.current,
//       width: "100%",
//       height: "100%",
//       userInfo: {
//         displayName: userName || "User",
//         email: userEmail || "",
//       },
//       configOverwrite: {
//         startWithAudioMuted: false,
//         startWithVideoMuted: false,
//         enableWelcomePage: false,
//         prejoinPageEnabled: false,
//       },
//       interfaceConfigOverwrite: {
//         DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
//         SHOW_JITSI_WATERMARK: false,
//         MOBILE_APP_PROMO: false,
//       },
//     };

//     try {
//       jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);
//       console.log("🎥 Jitsi meeting initialized for room:", roomPath);

//       jitsiApiRef.current.addEventListener("videoConferenceJoined", () => {
//         console.log("✅ Joined conference");
//         setIsLoading(false);
//         if (onConferenceJoined) onConferenceJoined();
//       });

//       jitsiApiRef.current.addEventListener("videoConferenceLeft", () => {
//         console.log("👋 Left conference");
//         if (onConferenceLeft) onConferenceLeft();
//       });
//     } catch (error) {
//       console.error("❌ Failed to initialize Jitsi:", error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-[80vh] bg-black rounded-lg overflow-hidden">
//       {isLoading && (
//         <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
//           <p className="text-white text-lg">
//             Connecting to video conference...
//           </p>
//         </div>
//       )}
//       <div ref={containerRef} className="w-full h-full" />
//     </div>
//   );
// };

// export default JitsiMeeting;

// "use client";

// import React, { useEffect, useRef, useState } from "react";

// interface JitsiMeetingProps {
//   roomName: string;
//   userName: string;
//   userEmail: string;
//   onReady?: () => void;
//   onConferenceJoined?: () => void;
//   onConferenceLeft?: () => void;
// }

// declare global {
//   interface Window {
//     JitsiMeetExternalAPI: any;
//   }
// }

// const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
//   roomName,
//   userName,
//   userEmail,
//   onReady,
//   onConferenceJoined,
//   onConferenceLeft,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const jitsiApiRef = useRef<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://meet.jit.si/external_api.js"; // ✅ use public server
//     script.async = true;
//     script.onload = () => {
//       console.log("✅ Jitsi API loaded");
//       if (onReady) onReady();
//       initializeJitsi();
//     };
//     script.onerror = () => {
//       console.error("❌ Failed to load Jitsi API script");
//       setIsLoading(false);
//     };
//     document.body.appendChild(script);

//     return () => {
//       if (jitsiApiRef.current) {
//         jitsiApiRef.current.dispose();
//         jitsiApiRef.current = null;
//       }
//     };
//   }, [roomName]);

//   const initializeJitsi = () => {
//     if (
//       !containerRef.current ||
//       typeof window.JitsiMeetExternalAPI === "undefined"
//     ) {
//       console.warn("⚠️ Jitsi API not available yet, retrying...");
//       setTimeout(initializeJitsi, 1500);
//       return;
//     }

//     const options = {
//       roomName: roomName,
//       width: "100%",
//       height: "100%",
//       parentNode: containerRef.current,
//       userInfo: {
//         displayName: userName || "User",
//         email: userEmail || "",
//       },
//       configOverwrite: {
//         startWithAudioMuted: false,
//         startWithVideoMuted: false,
//         enableWelcomePage: false,
//         prejoinPageEnabled: false,
//       },
//       interfaceConfigOverwrite: {
//         DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
//         SHOW_JITSI_WATERMARK: false,
//         MOBILE_APP_PROMO: false,
//       },
//     };

//     try {
//       jitsiApiRef.current = new window.JitsiMeetExternalAPI(
//         "meet.jit.si",
//         options
//       ); // ✅ public server
//       console.log("🎥 Jitsi meeting initialized for room:", roomName);

//       jitsiApiRef.current.addEventListener("videoConferenceJoined", () => {
//         console.log("✅ Joined conference");
//         setIsLoading(false);
//         if (onConferenceJoined) onConferenceJoined();
//       });

//       jitsiApiRef.current.addEventListener("videoConferenceLeft", () => {
//         console.log("👋 Left conference");
//         if (onConferenceLeft) onConferenceLeft();
//       });
//     } catch (error) {
//       console.error("❌ Failed to initialize Jitsi:", error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-[80vh] bg-black rounded-lg overflow-hidden">
//       {isLoading && (
//         <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
//           <p className="text-white text-lg">
//             Connecting to video conference...
//           </p>
//         </div>
//       )}
//       <div ref={containerRef} className="w-full h-full" />
//     </div>
//   );
// };

// export default JitsiMeeting;

// "use client";

// import React, { useEffect, useRef, useState } from "react";

// interface JitsiMeetingProps {
//   roomName: string;
//   userName: string;
//   userEmail: string;
//   isModerator?: boolean;
//   onReady?: () => void;
//   onConferenceJoined?: () => void;
//   onConferenceLeft?: () => void;
// }

// declare global {
//   interface Window {
//     JitsiMeetExternalAPI: any;
//   }
// }

// const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
//   roomName,
//   userName,
//   userEmail,
//   isModerator = false,
//   onReady,
//   onConferenceJoined,
//   onConferenceLeft,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const jitsiApiRef = useRef<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://8x8.vc/external_api.js";
//     script.async = true;
//     script.onload = () => {
//       if (onReady) onReady();
//       initializeJitsi();
//     };
//     script.onerror = () => {
//       console.error("❌ Failed to load Jitsi script");
//       setIsLoading(false);
//     };
//     document.body.appendChild(script);

//     return () => {
//       if (jitsiApiRef.current) {
//         jitsiApiRef.current.dispose();
//       }
//     };
//   }, [roomName]);

//   const initializeJitsi = () => {
//     if (!containerRef.current || !window.JitsiMeetExternalAPI) return;

//     const options = {
//       roomName: roomName,
//       width: "100%",
//       height: "100%",
//       parentNode: containerRef.current,
//       userInfo: {
//         displayName: userName,
//         email: userEmail,
//       },
//       configOverwrite: {
//         startWithAudioMuted: false,
//         startWithVideoMuted: false,
//         prejoinPageEnabled: false,
//         enableWelcomePage: false,
//       },
//       interfaceConfigOverwrite: {
//         SHOW_JITSI_WATERMARK: false,
//         DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
//       },
//     };

//     try {
//       jitsiApiRef.current = new window.JitsiMeetExternalAPI("8x8.vc", options);

//       jitsiApiRef.current.addEventListener("videoConferenceJoined", () => {
//         console.log("✅ Joined conference");
//         setIsLoading(false);
//         if (onConferenceJoined) onConferenceJoined();
//       });

//       jitsiApiRef.current.addEventListener("videoConferenceLeft", () => {
//         if (onConferenceLeft) onConferenceLeft();
//       });

//       // ✅ If moderator, grant moderator rights
//       if (isModerator) {
//         jitsiApiRef.current.executeCommand("subject", "Mentor-led Session");
//       }
//     } catch (error) {
//       console.error("Jitsi init failed:", error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-[80vh] bg-black rounded-lg overflow-hidden">
//       {isLoading && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
//           <p>Connecting to video conference...</p>
//         </div>
//       )}
//       <div ref={containerRef} className="w-full h-full" />
//     </div>
//   );
// };

// export default JitsiMeeting;

"use client";

import React, { useEffect, useRef, useState } from "react";

interface JitsiMeetingProps {
  roomName: string;
  userName: string;
  userEmail: string;
  isModerator?: boolean; // ✅ Mentor = moderator
  onReady?: () => void;
  onConferenceJoined?: () => void;
  onConferenceLeft?: () => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
  roomName,
  userName,
  userEmail,
  isModerator = false,
  onReady,
  onConferenceJoined,
  onConferenceLeft,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => {
      console.log("✅ Jitsi API loaded");
      if (onReady) onReady();
      initializeJitsi();
    };
    script.onerror = () => {
      console.error("❌ Failed to load Jitsi API script");
      setIsLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [roomName]);

  const initializeJitsi = () => {
    if (
      !containerRef.current ||
      typeof window.JitsiMeetExternalAPI === "undefined"
    ) {
      console.warn("⚠️ Waiting for Jitsi API...");
      setTimeout(initializeJitsi, 1000);
      return;
    }

    const domain = "meet.jit.si";
    const options = {
      roomName,
      width: "100%",
      height: "100%",
      parentNode: containerRef.current,
      userInfo: {
        displayName: userName || "User",
        email: userEmail || "",
      },
      configOverwrite: {
        prejoinPageEnabled: false,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        disableModeratorIndicator: !isModerator, // ✅ Only mentor = moderator
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
        MOBILE_APP_PROMO: false,
      },
    };

    try {
      jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      if (isModerator) {
        // ✅ Make mentor moderator
        jitsiApiRef.current.executeCommand("toggleLobby", false);
      }

      jitsiApiRef.current.addEventListener("videoConferenceJoined", () => {
        console.log("✅ Joined room:", roomName);
        setIsLoading(false);
        if (onConferenceJoined) onConferenceJoined();
      });

      jitsiApiRef.current.addEventListener("videoConferenceLeft", () => {
        console.log("👋 Left room");
        if (onConferenceLeft) onConferenceLeft();
      });
    } catch (err) {
      console.error("❌ Failed to init Jitsi:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-[80vh] bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">
            Connecting to video conference...
          </p>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default JitsiMeeting;
