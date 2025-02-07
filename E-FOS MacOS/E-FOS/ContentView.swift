import SwiftUI

struct ContentView: View {
    @State private var isHovered: [Bool] = [false, false, false, false] // Tracks hover states for all buttons

    var body: some View {
        ZStack {
            Color(nsColor: NSColor.controlBackgroundColor)
                .edgesIgnoringSafeArea(.all)

            VStack(spacing: 0) {
                // Title and Description
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
                    menuButton(title: "Neptun", shortcut: "", iconName: "neptun_icon", link: "https://neptun.elte.hu", index: 0)
                    menuButton(title: "Canvas", shortcut: "", iconName: "canvas_icon", link: "https://canvas.elte.hu", index: 1)
                    menuButton(title: "TMS", shortcut: "", iconName: "tms_icon", link: "https://tms.inf.elte.hu", index: 2)
                }
                .background(Color(.controlBackgroundColor)) // macOS menu background

                // Quit Button Styled Like macOS
                Button(action: {
                    NSApplication.shared.terminate(nil)
                }) {
                    HStack {
                        Text("Quit E-FOS")
                        Spacer()
                        Text("⌘Q")
                            .foregroundColor(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.horizontal, 12)
                    .contentShape(Rectangle()) // Makes entire row clickable
                }
                .buttonStyle(PlainButtonStyle())
                .padding(.vertical, 8)
                .background(isHovered[3] ? Color.blue.opacity(0.2) : Color.clear) // Hover effect
                .cornerRadius(4)
                .onHover { hovering in
                    isHovered[3] = hovering
                }
            }
            .padding()
            .frame(width: 300, height: 400)
        }
    }

    // Menu Button Helper
    private func menuButton(title: String, shortcut: String, iconName: String, link: String, index: Int) -> some View {
        Button(action: {
            if let url = URL(string: link) {
                NSWorkspace.shared.open(url)
            }
        }) {
            HStack {
                Image(iconName) // Your PNG icon
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                Text(title)
                Spacer()
                Text(shortcut)
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 12)
            .contentShape(Rectangle()) // Makes entire row clickable
        }
        .buttonStyle(PlainButtonStyle())
        .padding(.vertical, 8)
        .background(isHovered[index] ? Color.blue.opacity(0.2) : Color.clear) // Hover effect
        .cornerRadius(4)
        .onHover { hovering in
            isHovered[index] = hovering
        }
    }
}

#Preview {
    ContentView()
}
