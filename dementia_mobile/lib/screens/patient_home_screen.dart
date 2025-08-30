import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class PatientHomeScreen extends StatefulWidget {
  const PatientHomeScreen({super.key});

  @override
  State<PatientHomeScreen> createState() => _PatientHomeScreenState();
}

class _PatientHomeScreenState extends State<PatientHomeScreen> {
  Map<String, dynamic>? profile;
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchProfileFromStorage();
  }

  Future<void> fetchProfileFromStorage() async {
    final storage = const FlutterSecureStorage();
    final token = await storage.read(key: 'access');

    if (token == null) {
      setState(() {
        error = 'No access token found.';
        isLoading = false;
      });
      return;
    }

    try {
      final response = await http.get(
        Uri.parse('http://127.0.0.1:8000/api/patient/me/'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        setState(() {
          profile = jsonDecode(response.body);
          isLoading = false;
        });
      } else {
        setState(() {
          error = 'Failed: ${response.statusCode}';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Error: $e';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Patient Home"),
        backgroundColor: Colors.indigo,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => Navigator.pushReplacementNamed(context, '/'),
          ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF74EBD5), Color(0xFFACB6E5)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    if (error != null)
                      Text(error!, style: const TextStyle(color: Colors.red)),
                    Card(
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(18)),
                      elevation: 8,
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CircleAvatar(
                              radius: 32,
                              backgroundColor: Colors.indigo.shade200,
                              child: const Icon(Icons.person,
                                  size: 38, color: Colors.white),
                            ),
                            const SizedBox(width: 20),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text("Hello, ${profile?['username'] ?? 'Patient'}",
                                      style: const TextStyle(
                                          fontSize: 22,
                                          fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 6),
                                  Text('Gender: ${profile?['gender'] ?? 'N/A'}'),
                                  Text('Age: ${profile?['age'] ?? 'N/A'}'),
                                  Text('Address: ${profile?['address'] ?? 'N/A'}'),
                                  Text('Emergency Contact: ${profile?['emergency_contact'] ?? 'N/A'}'),
                                ],
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _HomeFeatureButton(
                          icon: Icons.person,
                          label: 'Profile',
                          onTap: () {},
                        ),
                        _HomeFeatureButton(
                          icon: Icons.show_chart,
                          label: 'Progress',
                          onTap: () {},
                        ),
                        _HomeFeatureButton(
                          icon: Icons.mic,
                          label: 'Recordings',
                          onTap: () {
                            Navigator.pushNamed(context, '/recordings');
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),
                    Card(
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      child: ListTile(
                        leading:
                            const Icon(Icons.info, color: Colors.indigo),
                        title: const Text("Medical History"),
                        subtitle: Text(profile?['patient_data']
                                ?['medical_history'] ??
                            'No medical history.'),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Card(
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      child: const ListTile(
                        leading: Icon(Icons.settings, color: Colors.grey),
                        title: Text("Settings"),
                        subtitle: Text("Manage your preferences."),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

class _HomeFeatureButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _HomeFeatureButton(
      {required this.icon, required this.label, required this.onTap, super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: Colors.indigo.shade100,
            child: Icon(icon, size: 30, color: Colors.indigo.shade700),
          ),
          const SizedBox(height: 6),
          Text(label,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
