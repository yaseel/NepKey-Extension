import SwiftUI
import AppKit

struct ContentView: View {
    // Hover states for main rows
    @State private var isHovered: [Bool] = [false, false, false, false, false]
    
    // Hover states for TMS Focus Mode sub-buttons
    @State private var hoverFocusModeCopy = false
    @State private var hoverFocusModeInfo = false

    // Hover states for sheet buttons
    @State private var hoverSheetOpenTms = false
    @State private var hoverSheetCopyJs = false

    @State private var showInfoSheet = false
    @State private var showFullImage = false
    @State private var isImageFullscreen = false
    @State private var showCopiedAlert = false
    
    var body: some View {
        ZStack {
            Color(nsColor: NSColor.controlBackgroundColor)
                .edgesIgnoringSafeArea(.all)
            
            VStack(spacing: 0) {
                // Title
                Text("E-FOS")
                    .font(.largeTitle)
                    .bold()
                    .padding(.vertical, 8)
                
                Text("ELTE Felhasználóbarát Offline Segéd")
                    .font(.footnote)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.bottom, 16)
                
                // Menu Buttons
                VStack(spacing: 0) {
                    // 1) Neptun
                    menuButton(
                        title: "Neptun",
                        iconName: "neptun_icon",
                        link: "https://neptun.elte.hu",
                        hoverIndex: 0
                    )
                    // 2) Canvas
                    menuButton(
                        title: "Canvas",
                        iconName: "canvas_icon",
                        link: "https://canvas.elte.hu",
                        hoverIndex: 1
                    )
                    // 3) TMS
                    menuButton(
                        title: "TMS",
                        iconName: "tms_icon",
                        link: "https://tms.inf.elte.hu",
                        hoverIndex: 2
                    )
                    
                    // 4) TMS Focus Mode row
                    HStack(spacing: 8) {
                        // Entire row: opens info sheet
                        Button {
                            showInfoSheet = true
                        } label: {
                            HStack {
                                Image("tms_focus_icon")
                                    .resizable()
                                    .scaledToFit()
                                    .frame(width: 24, height: 24)
                                
                                Text("TMS Focus Mode")
                                    .font(.body)
                                
                                Spacer()
                            }
                            .padding(.horizontal, 12)
                            .contentShape(Rectangle())
                        }
                        .buttonStyle(PlainButtonStyle())
                        
                        // Copy JS sub-button
                        Button {
                            copyBookmarkletToClipboard()
                        } label: {
                            Text("Copy JS")
                                .font(.footnote)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(hoverFocusModeCopy ? Color.blue.opacity(0.5) : Color.blue)
                                .cornerRadius(4)
                        }
                        .buttonStyle(PlainButtonStyle())
                        .onHover { hovering in
                            hoverFocusModeCopy = hovering
                        }
                        
                        // Info sub-button
                        Button {
                            showInfoSheet = true
                        } label: {
                            Image(systemName: "info.circle")
                                .foregroundColor(.primary)
                                .padding(4)
                                .background(hoverFocusModeInfo ? Color.blue.opacity(0.5) : Color.clear)
                                .cornerRadius(4)
                        }
                        .buttonStyle(PlainButtonStyle())
                        .onHover { hovering in
                            hoverFocusModeInfo = hovering
                        }
                        .padding(.trailing, 8) // extra spacing from right edge
                        
                    }
                    .padding(.vertical, 8)
                    .background(isHovered[3] ? Color.blue.opacity(0.1) : Color.clear)
                    .cornerRadius(4)
                    .onHover { hovering in
                        isHovered[3] = hovering
                    }
                }
                .background(Color(nsColor: NSColor.controlBackgroundColor))
                
                // 5) Quit
                Button {
                    NSApplication.shared.terminate(nil)
                } label: {
                    HStack {
                        Text("Quit E-FOS")
                        Spacer()
                        Text("⌘Q")
                            .foregroundColor(.gray)
                    }
                    .padding(.horizontal, 12)
                    .contentShape(Rectangle())
                }
                .buttonStyle(PlainButtonStyle())
                .padding(.vertical, 8)
                .background(isHovered[4] ? Color.blue.opacity(0.1) : Color.clear)
                .cornerRadius(4)
                .onHover { hovering in
                    isHovered[4] = hovering
                }
            }
            .padding()
            .frame(width: 300, height: 400)
        }
        // Instructions in a sheet
        .sheet(isPresented: $showInfoSheet) {
            ZStack {
                if isImageFullscreen {
                    // Fullscreen Image
                    Image("guide_screenshot")
                        .resizable()
                        .scaledToFit()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .transition(.opacity.animation(.easeInOut(duration: 0.3)))
                        .onTapGesture {
                            withAnimation {
                                isImageFullscreen.toggle()
                            }
                        }
                } else {
                    // Default Info View
                    HStack(alignment: .center, spacing: 20) {
                        // Left: Instructions
                        VStack(alignment: .leading, spacing: 12) {
                            Text("How to Enable TMS Focus Mode")
                                .font(.title2)
                                .bold()
                                .padding(.top, 20)
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("1. Open TMS in your browser.")
                                Text("2. Open the **task** you want to focus on.")
                                Text("3. Click the search bar of your browser.")
                                Text("4. Paste the copied JavaScript (`Cmd + V`).")
                                Text("5. Press Enter to apply Focus Mode.")
                                Text("To undo this feature refresh the page.")
                            }
                            
                            // Buttons below the instructions
                            VStack(spacing: 8) {
                                // Open TMS
                                Button {
                                    if let tmsURL = URL(string: "https://tms.inf.elte.hu") {
                                        NSWorkspace.shared.open(tmsURL)
                                    }
                                } label: {
                                    Text("Open TMS")
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 6)
                                        .background(Color(NSColor.controlColor))
                                        .cornerRadius(4)
                                        .foregroundColor(.primary)
                                }
                                .buttonStyle(PlainButtonStyle())
                                .onHover { hovering in
                                    hoverSheetOpenTms = hovering
                                }
                                
                                // Copy JS Code
                                Button {
                                    copyBookmarkletToClipboard()
                                    showInfoSheet = false
                                } label: {
                                    Text("Copy JavaScript Code")
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 6)
                                        .background(Color.blue.opacity(0.8))
                                        .cornerRadius(4)
                                        .foregroundColor(.white)
                                }
                                .buttonStyle(PlainButtonStyle())
                                .onHover { hovering in
                                    hoverSheetCopyJs = hovering
                                }
                            }
                            
                            Spacer()
                            
                            // Close Button
                            HStack {
                                Spacer()
                                Button("Close") {
                                    showInfoSheet = false
                                }
                                .foregroundColor(.red)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding()
                        
                        // Right: Image with Click-to-Enlarge
                        VStack {
                            Spacer()
                            Button(action: {
                                withAnimation {
                                    isImageFullscreen.toggle()
                                }
                            }) {
                                Image("guide_screenshot")
                                    .resizable()
                                    .scaledToFit()
                                    .frame(width: 200, height: 150)
                                    .cornerRadius(6)
                                    .shadow(radius: 3)
                            }
                            .buttonStyle(PlainButtonStyle())
                            
                            Text("Guide")
                                .font(.footnote)
                                .foregroundColor(.gray)
                            Spacer()
                        }
                        .frame(maxWidth: 220)
                    }
                    .transition(.opacity.animation(.easeInOut(duration: 0.3)))
                }
            }
            .padding(20)
            .frame(minWidth: 600, minHeight: 400)
        }
        
        // Copied Alert
        .alert("Copied!", isPresented: $showCopiedAlert) {
            Text("The JavaScript code has been copied. Paste it into your browser's address bar and press Enter.")
        }
    }
    
    private var fullImageView: some View {
        VStack {
            Image("guide_screenshot")
                .resizable()
                .scaledToFit()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .padding()
            
            Button("Close") {
                showFullImage = false
            }
            .padding(.bottom, 20)
            .foregroundColor(.red)
        }
        .background(Color.black.opacity(0.9))
    }
    
    private func copyBookmarkletToClipboard() {
        let bookmarkletCode = """
        javascript:(function(){
          document.documentElement.style.width="100vw";
          document.documentElement.style.overflowX="hidden";
          document.body.style.width="100vw";
          document.body.style.overflowX="hidden";
          document.querySelectorAll(".row").forEach(el=>el.style.display="inline");
          document.querySelectorAll(".col-md-3, .col-md-4, .navbar, .content-title, .d-flex.justify-content-between.flex-wrap.flex-md-nowrap.align-items-center.pb-2.mb-2.border-bottom").forEach(el=>el.remove());
          document.querySelectorAll(".col-xl-10, .col-md-9").forEach(el=>el.style.maxWidth="97%");
        })()
        """
        
        let pasteboard = NSPasteboard.general
        pasteboard.clearContents()
        pasteboard.setString(bookmarkletCode, forType: .string)
        
        showCopiedAlert = true
    }
    
    // Reusable menu button
    private func menuButton(title: String, iconName: String, link: String, hoverIndex: Int) -> some View {
        Button {
            if let url = URL(string: link) {
                NSWorkspace.shared.open(url)
            }
        } label: {
            HStack {
                Image(iconName)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                Text(title)
                Spacer()
            }
            .padding(.horizontal, 12)
            .contentShape(Rectangle())
        }
        .buttonStyle(PlainButtonStyle())
        .padding(.vertical, 8)
        .background(isHovered[hoverIndex] ? Color.blue.opacity(0.1) : Color.clear)
        .cornerRadius(4)
        .onHover { hovering in
            isHovered[hoverIndex] = hovering
        }
    }
}

#Preview {
    ContentView()
}
