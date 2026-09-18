const VAPID_PUBLIC_KEY = "BKh0j1bYF7u16zKB8PRHus-7aw9zRAMW8UwvO_5-WbDK-KyU7bMyvqrgQkRPvFT-nZ2wG_JVM-7yb1P8rumbb9c";
const WORKER_URL = "https://mute-tree-5cba.kebab67123.workers.dev";

// POPRAWIONA I BEZPIECZNA FUNKCJA KONWERSJI KLUCZA VAPID
function urlBase64ToUint8Array(base64String) {
  // Usuwamy ewentualne białe znaki
  const base64Clean = base64String.trim();
  // Zastępujemy znaki URL-safe standardowymi znakami Base64
  let base64 = base64Clean.replace(/-/g, "+").replace(/_/g, "/");
  
  // Dynamicznie dodajemy poprawne dopełnienie matematyczne '=', jeśli go brakuje
  const pad = base64.length % 4;
  if (pad === 2) {
    base64 += "==";
  } else if (pad === 3) {
    base64 += "=";
  }

  // Bezpieczne dekodowanie ciągu binarnego
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

document.getElementById("enableNotifications").addEventListener("click", async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("Notifications were not allowed.");
      return;
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    // Przeglądarka bez problemu przepuści teraz Twój klucz publiczny
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    const response = await fetch(`${WORKER_URL}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(subscription)
    });

    if (!response.ok) {
      throw new Error("Failed to save subscription");
    }

    alert("Notifications enabled! 🔔");

  } catch (error) {
    console.error("Szczegóły błędu w konsoli:", error);
    alert("Something went wrong.");
  }
});
