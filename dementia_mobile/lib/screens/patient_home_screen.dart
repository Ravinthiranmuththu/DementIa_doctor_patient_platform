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
  String? debugUsername;
  String? debugToken;
  String? debugApiStatus;
  String? debugApiBody;

  @override
  void initState() {
    super.initState();
    fetchProfileFromStorage();
  }

  Future<void> fetchProfileFromStorage() async {
    setState(() {
      isLoading = true;
      error = null;
    });
    final storage = FlutterSecureStorage();
    final username = await storage.read(key: 'username');
    final token = await storage.read(key: 'access');
    setState(() {
      debugUsername = username;
      debugToken = token;
    });
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
        headers: {
          'Authorization': 'Bearer $token',
        },
      );
      setState(() {
        debugApiStatus = response.statusCode.toString();
        debugApiBody = response.body;
      });
      if (response.statusCode == 200) {
        setState(() {
          profile = jsonDecode(response.body);
          isLoading = false;
        });
      } else {
        setState(() {
          error = 'Failed to load profile: ${response.statusCode}';
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
        title: const Text('Patient Home'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/');
            },
            tooltip: 'Logout',
          ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (error != null)
                      Text(error!, style: const TextStyle(color: Colors.red)),
                    // Modern patient info card
                    Card(
                      elevation: 6,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                      color: Colors.blue.shade50,
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CircleAvatar(
                              radius: 32,
                              backgroundColor: Colors.blue.shade200,
                              child: Icon(Icons.person, size: 38, color: Colors.white),
                            ),
                            const SizedBox(width: 20),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Hello, ${profile?['username'] ?? 'Patient'}',
                                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                                  ),
                                  const SizedBox(height: 8),
                                  Text('Gender: ${profile?['gender'] ?? 'N/A'}'),
                                  Text('Age: ${profile?['age'] ?? 'N/A'}'),
                                  Text('Address: ${profile?['address'] ?? 'N/A'}'),
                                  Text('Emergency Contact: ${profile?['emergency_contact'] ?? 'N/A'}'),
                                ],
                              ),
                            ),
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
                              onTap: () {
                                // TODO: Navigate to profile screen
                              },
                            ),
                            _HomeFeatureButton(
                              icon: Icons.show_chart,
                              label: 'Progress',
                              onTap: () {
                                // TODO: Navigate to progress/graph screen
                              },
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
                          elevation: 2,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          child: ListTile(
                            leading: const Icon(Icons.info, color: Colors.blue),
                            title: const Text('Medical History'),
                            subtitle: Text(profile?['patient_data']?['medical_history'] ?? 'No medical history.'),
                            onTap: () {
                              // TODO: Navigate to medical history screen
                            },
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          elevation: 2,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          child: ListTile(
                            leading: const Icon(Icons.settings, color: Colors.grey),
                            title: const Text('Settings'),
                            subtitle: const Text('Manage your account and preferences.'),
                            onTap: () {
                              // TODO: Navigate to settings screen
                            },
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

  const _HomeFeatureButton({
    required this.icon,
    required this.label,
    required this.onTap,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: Colors.blue.shade100,
            child: Icon(icon, size: 32, color: Colors.blue.shade700),
          ),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
