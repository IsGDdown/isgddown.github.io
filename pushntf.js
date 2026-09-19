const enableNotifications = document.getElementById("enableNotifications");

enableNotifications.addEventListener("click", () => {
    OneSignalDeferred.push(async function (OneSignal) {
        try {
            if (!OneSignal.Notifications.isPushSupported()) {
                alert("Your browser does not support push notifications.");
                return;
            }

            await OneSignal.Notifications.requestPermission();

            await OneSignal.User.PushSubscription.optIn();

            if (OneSignal.User.PushSubscription.optedIn) {
                enableNotifications.innerText = "✅";
                alert("Notifications enabled! 🔔");
            } else {
                alert("Notifications were not enabled.");
            }

        } catch (error) {
            console.error("OneSignal error:", error);
            alert("Something went wrong.");
        }
    });
});
