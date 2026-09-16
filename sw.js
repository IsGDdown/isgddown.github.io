self.addEventListener("push", event => {
  const data = event.data
    ? event.data.json()
    : {
        title:"IsGdDown",
        body:"🔴 Geometry Dash is Down. We will inform you when its back up."
      };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/Favicon.ico",
      badge: "/Favicon.ico"
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow("https://isgddown.github.io/")
  );
});
