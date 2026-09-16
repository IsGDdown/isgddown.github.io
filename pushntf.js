const VAPID_PUBLIC_KEY = "BF9QSKTYWOK9xnZVZ3o1ObEMW957nIh0mMEeLSnv9853TW-HnG9VEgslLWT8AMmI4aA7uUNwocKgTSJpuodf3Is";
const WORKER_URL = "https://mute-tree-5cba.kebab67123.workers.dev/";

document.getElementById("enableNotifications").addEventListener("click", async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("Notifications were not allowed.");
      return;
    }

    const registration = await navigator.serviceWorker.register("/sw.js");

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY
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
