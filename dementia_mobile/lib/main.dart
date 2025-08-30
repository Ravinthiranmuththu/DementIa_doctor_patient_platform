import 'package:flutter/material.dart';
import 'screens/patient_login_screen.dart';
import 'screens/patient_home_screen.dart';
import 'screens/recordings_page.dart';

void main() {
  runApp(const DementiaApp());
}

class DementiaApp extends StatelessWidget {
  const DementiaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
<<<<<<< HEAD
      title: 'Dementia Patient Web App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
=======
      title: 'Dementia Patient App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
<<<<<<< HEAD
        '/': (context) => const PatientLoginScreen(),
=======
        '/': (context) => PatientLoginScreen(),
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
        '/home': (context) => const PatientHomeScreen(),
        '/recordings': (context) => const RecordingsPage(),
      },
    );
  }
}
<<<<<<< HEAD
=======

>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
