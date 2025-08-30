import 'package:flutter/material.dart';
import 'screens/recording_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dementia Mobile',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const RecordingPage(),
    );
  }
}
