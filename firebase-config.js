/* =========================================================================
   MY HEALTH — Firebase config + init  (shared)
   -------------------------------------------------------------------------
   Eta HTML e firebase compat SDK script gulor PORE, kintu app.js/admin er
   AGE load hoy. window.fdb (database), window.fauth (auth), ADMIN_EMAIL
   expose kore. Firebase CDN load na hole site product.js seed diye cholbe.
   ========================================================================= */
(function () {
  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK load hoyni — site product.js seed diye cholbe.');
    return;
  }
  const firebaseConfig = {
    apiKey: "AIzaSyCy8kYrSQsfXFgwYZDf5IZlAsOzOsxmxRw",
    authDomain: "myhealth-6a311.firebaseapp.com",
    databaseURL: "https://myhealth-6a311-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "myhealth-6a311",
    storageBucket: "myhealth-6a311.firebasestorage.app",
    messagingSenderId: "1021250658912",
    appId: "1:1021250658912:web:3b4d73e5b59d221ef25905"
  };
  firebase.initializeApp(firebaseConfig);
  window.fdb = firebase.database();
  if (firebase.auth) window.fauth = firebase.auth();
  window.ADMIN_EMAIL = "mijanu443@gmail.com";
})();