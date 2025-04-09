import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';

Future initFirebase() async {
  if (kIsWeb) {
    await Firebase.initializeApp(
        options: FirebaseOptions(
            apiKey: "AIzaSyA87ZEismJN19FCapY7Q4NA74oeiOBVxrc",
            authDomain: "mirray-litdjo.firebaseapp.com",
            projectId: "mirray-litdjo",
            storageBucket: "mirray-litdjo.firebasestorage.app",
            messagingSenderId: "920115133260",
            appId: "1:920115133260:web:96614062fb51b13ecbade9"));
  } else {
    await Firebase.initializeApp();
  }
}
