const { app, Menu, Tray, nativeImage } = require("electron");

const checkNetFreeHttps = async () => {
  try {
    const response = await fetch("http://api.internal.netfree.link/user/0", {
      timeout: 10000,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return true;
  } catch (error) {
    return false;
  }
};

let tray = null;
app.whenReady().then(() => {
  app.dock.hide();
  const icon = nativeImage.createFromPath(__dirname + "/ok.png");
  console.log(icon);
  tray = new Tray(icon);
  console.log(tray);

  tray.setToolTip("NetFree is connected successfully.");

  const detectNetFree = async () => {
    const isConnected = await checkNetFreeHttps();
    if (isConnected) {
      tray.setToolTip("NetFree is connected successfully.");
      tray.setImage(nativeImage.createFromPath(__dirname + "/ok.png"));
    } else {
      tray.setToolTip("NetFree is not connected.");
      tray.setImage(nativeImage.createFromPath(__dirname + "/notOk.png"));
    }
  };
  detectNetFree();
  setInterval(detectNetFree, 1000000); // 10 minutes

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Refresh",
      click: () => {
        detectNetFree();
      },
    },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
});
