const VAPID_PUBLIC_KEY = "BKh0j1bYF7u16zKB8PRHus-7aw9zRAMW8UwvO_5-WbDK-KyU7bMyvqrgQkRPvFT-nZ2wG_JVM-7yb1P8rumbb9c";
const WORKER_URL = "https://mute-tree-5cba.kebab67123.workers.dev";


function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from(
    [...rawData].map(char => char.charCodeAt(0))
  );
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
    console.error(error);
    alert("Something went wrong.");
  }
});
