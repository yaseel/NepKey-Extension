# EFOS (ELTE Felhasználóbarát Open-Source Segéd)

[English Version](#english-version) | [Magyar Verzió](#magyar-verzió)

---

## English Version

### EFOS (ELTE Felhasználóbarát Open-Source Segéd)

EFOS is a **browser extension** designed to streamline access to ELTE-related websites and services. It provides quick login automation, website shortcuts, and other useful university-related utilities. All login data is stored locally on your computer, ensuring security.

### Installation

1. **Install from the Chrome Web Store** (coming soon to the App Store). EFOS is compatible with browsers that support the Chrome Web Store, including **Chrome, Brave, and others**.
2. **Pin EFOS** to your browser toolbar for quick access.

### First Setup: Getting the OTP Secret for Auto-Login

![](https://github.com/yaseel/EFOS/blob/main/EFOS%20Chrome/images/tutorial4.gif)

EFOS uses TOTP (Time-based One-Time Password) authentication to log into Neptun automatically. To set it up:

1. **Go to Neptun** and log in with your username and password.
   - When prompted for TOTP, click on **"New TOTP pairing"** (`Új TOTP párosítás`).
2. Copy the **secret key** displayed below.
3. Paste this secret key into EFOS under the **OTP Configuration** section.
4. *(Optional, recommended)* Add the secret key to your preferred phone authenticator (e.g., Microsoft Authenticator, Google Authenticator) for backup.

Once set up, EFOS will generate the correct TOTP code automatically during login.

### Using EFOS

#### Auto-Login Toggles

- EFOS provides toggles for enabling or disabling auto-login for specific ELTE services.
- When enabled, EFOS will handle login whenever you open the respective site using the buttons available.

#### Website Shortcuts

- Click on any website in the EFOS menu to open it instantly.
- Auto-login will only activate **if clicked through EFOS** (not when manually entering the URL in a browser).

### Additional Features

- **Minimal Interface:** Simple and efficient UI for quick access.
- **Security:** All credentials are stored locally and never transmitted.

---

## Magyar Verzió

### EFOS (ELTE Felhasználóbarát Open-Source Segéd)

Az EFOS egy **böngészőbővítmény**, amely egyszerűbbé teszi az ELTE-vel kapcsolatos weboldalak és szolgáltatások elérését. Automatikus bejelentkezést, gyors elérési útvonalakat és egyéb egyetemi segédfunkciókat kínál. Minden bejelentkezési adat helyben, a számítógépen tárolódik, biztosítva a biztonságot.

### Telepítés

1. **Telepítsd a Chrome Web Store-ból** (hamarosan elérhető az App Store-ban). Az EFOS kompatibilis más böngészőkkel is, amelyek támogatják a Chrome Web Store-t, például **Chrome, Brave és más böngészők**.
2. **Rögzítsd az EFOS-t** a böngésző eszköztárán a gyors elérés érdekében.

### Első lépések: OTP titkos kulcs beszerzése az automatikus bejelentkezéshez

![](https://github.com/yaseel/EFOS/blob/main/EFOS%20Chrome/images/tutorial4.gif)

Az EFOS TOTP (időalapú egyszer használatos jelszó) hitelesítést használ a Neptun automatikus bejelentkezéséhez. Beállításához:

1. **Nyisd meg a Neptunt**, és jelentkezz be felhasználóneveddel és jelszavaddal.
   - Amikor a rendszer TOTP-t kér, kattints a **„Új TOTP párosítás”** gombra.
2. Másold ki az alul megjelenő **titkos kulcsot**.
3. Illeszd be ezt a kulcsot az EFOS **OTP konfigurációs** szakaszába.
4. *(Opcionális, ajánlott)* Add hozzá a kulcsot egy általad preferált telefonos hitelesítő alkalmazásba (pl. Microsoft Authenticator, Google Authenticator) biztonsági másolatként.

A beállítás után az EFOS automatikusan generálja a megfelelő TOTP kódot bejelentkezéskor.

### Az EFOS használata

#### Automatikus bejelentkezés kapcsolók

- Az EFOS lehetőséget biztosít az automatikus bejelentkezés engedélyezésére vagy letiltására az egyes ELTE-szolgáltatásokhoz.
- Ha engedélyezve van, az EFOS automatikusan bejelentkezik, amikor a megfelelő oldalt megnyitod az elérhető gombok segítségével.

#### Weboldal gyorsgombok

- Kattints bármelyik weboldalra az EFOS menüben, hogy azonnal megnyíljon.
- Az automatikus bejelentkezés **csak akkor aktiválódik, ha az EFOS-ból kattintasz** (nem, ha manuálisan írod be az URL-t a böngészőben).

### További funkciók

- **Minimális felület:** Egyszerű és hatékony kezelőfelület a gyors hozzáféréshez.
- **Biztonság:** Minden hitelesítési adat helyben kerül tárolásra, és soha nem kerül továbbításra.

