# NepKey

[English Version](#english-version) | [Magyar Verzió](#magyar-verzió)

---

## English Version

### NepKey

NepKey is a **browser extension** designed to streamline access to ELTE-related websites and services. It provides quick login automation, website shortcuts, and other useful university-related utilities. All login data is stored locally on your computer, ensuring security.

### Installation

1. **<a href="https://chromewebstore.google.com/detail/mdhkgneadmdcggghabhelllpkodboiii?utm_source=item-share-cb" target="_blank">Install from the Chrome Web Store</a>** (coming soon to the App Store). NepKey is compatible with browsers that support the Chrome Web Store, including **Chrome, Brave, and others**.
2. **Pin NepKey** to your browser toolbar for quick access.

### First Setup: Getting the OTP Secret for Auto-Login

<img src="https://raw.githubusercontent.com/yaseel/NepKey-Extension/main/otp-tutorial.gif" />

NepKey uses TOTP (Time-based One-Time Password) authentication to log into Neptun automatically. To set it up:

1. **Go to Neptun** and log in with your username and password.
   - When prompted for TOTP, click on **"New TOTP pairing"** (`Új TOTP párosítás`).
2. Copy the **secret key** displayed below.
3. Paste this secret key into NepKey under the **OTP Configuration** section.
4. Add the secret key to your preferred phone authenticator (e.g., Microsoft Authenticator, Google Authenticator) for backup.

Once set up, NepKey will generate the correct TOTP code automatically during login.

### Using NepKey

#### Website Shortcuts

- Click on any website in the NepKey menu to open it instantly.
- Auto-login will only activate **if clicked through NepKey** (not when manually entering the URL in a browser).

### Additional Features

- **Minimal Interface:** Simple and efficient UI for quick access.
- **Security:** All credentials are stored locally and never transmitted.

---

## Magyar Verzió

### NepKey

Az NepKey egy **böngészőbővítmény**, amely egyszerűbbé teszi az ELTE-vel kapcsolatos weboldalak és szolgáltatások elérését. Automatikus bejelentkezést, gyors elérési útvonalakat és egyéb egyetemi segédfunkciókat kínál. Minden bejelentkezési adat helyben, a számítógépen tárolódik, biztosítva a biztonságot.

### Telepítés

1. **<a href="https://chromewebstore.google.com/detail/mdhkgneadmdcggghabhelllpkodboiii?utm_source=item-share-cb" target="_blank">Telepítsd a Chrome Web Store-ból</a>** (hamarosan elérhető az App Store-ban). NepKey kompatibilis más böngészőkkel is, amelyek támogatják a Chrome Web Store-t, például **Chrome, Brave és más böngészők**.
2. **Rögzítsd az NepKey-t** a böngésző eszköztárán a gyors elérés érdekében.

### Első lépések: OTP titkos kulcs beszerzése az automatikus bejelentkezéshez

<img src="https://raw.githubusercontent.com/yaseel/NepKey-Extension/main/otp-tutorial.gif" />

A NepKey TOTP (időalapú egyszer használatos jelszó) hitelesítést használ a Neptun automatikus bejelentkezéséhez. Beállításához:

1. **Nyisd meg a Neptunt**, és jelentkezz be felhasználóneveddel és jelszavaddal.
   - Amikor a rendszer TOTP-t kér, kattints a **„Új TOTP párosítás”** gombra.
2. Másold ki az alul megjelenő **titkos kulcsot**.
3. Illeszd be ezt a kulcsot az NepKey **OTP konfigurációs** szakaszába.
4. Add hozzá a kulcsot egy általad preferált telefonos hitelesítő alkalmazásba (pl. Microsoft Authenticator, Google Authenticator) biztonsági másolatként.

A beállítás után az NepKey automatikusan generálja a megfelelő TOTP kódot bejelentkezéskor.

### Az NepKey használata

#### Weboldal gyorsgombok

- Kattints bármelyik weboldalra az NepKey menüben, hogy azonnal megnyíljon.
- Az automatikus bejelentkezés **csak akkor aktiválódik, ha a NepKey-ből kattintasz** (nem, ha manuálisan írod be az URL-t a böngészőben).

### További funkciók

- **Minimális felület:** Egyszerű és hatékony kezelőfelület a gyors hozzáféréshez.
- **Biztonság:** Minden hitelesítési adat helyben kerül tárolásra, és soha nem kerül továbbításra.

