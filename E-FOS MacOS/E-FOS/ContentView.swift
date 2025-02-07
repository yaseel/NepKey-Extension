import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("E-FOS")
                .font(.largeTitle)
                .bold()
                .padding()

            HStack(spacing: 40) {
                VStack {
                    Link(destination: URL(string: "https://neptun.elte.hu")!) {
                        VStack {
                            Image("neptun_icon")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 50, height: 50)
                            Text("Neptun")
                                .font(.headline)
                        }
                    }
                }

                VStack {
                    Link(destination: URL(string: "https://canvas.elte.hu")!) {
                        VStack {
                            Image("canvas_icon")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 50, height: 50)
                            Text("Canvas")
                                .font(.headline)
                        }
                    }
                }

                VStack {
                    Link(destination: URL(string: "https://tms.inf.elte.hu")!) {
                        VStack {
                            Image("tms_icon")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 50, height: 50)
                            Text("TMS")
                                .font(.headline)
                        }
                    }
                }
            }
            .padding()
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
