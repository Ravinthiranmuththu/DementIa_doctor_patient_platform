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
      title: 'Dementia Patient App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => PatientLoginScreen(),
        '/home': (context) => const PatientHomeScreen(),
        '/recordings': (context) => const RecordingsPage(),
      },
    );
  }
}

