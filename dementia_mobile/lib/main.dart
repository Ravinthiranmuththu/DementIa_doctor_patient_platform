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
      title: 'Dementia Patient Web App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const PatientLoginScreen(),
        '/home': (context) => const PatientHomeScreen(),
        '/recordings': (context) => const RecordingsPage(),
      },
    );
  }
}
