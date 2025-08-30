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
<<<<<<< HEAD
=======
  String? debugUsername;
  String? debugToken;
  String? debugApiStatus;
  String? debugApiBody;
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6

  @override
  void initState() {
    super.initState();
    fetchProfileFromStorage();
  }

  Future<void> fetchProfileFromStorage() async {
<<<<<<< HEAD
    final storage = const FlutterSecureStorage();
    final token = await storage.read(key: 'access');

=======
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
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
    if (token == null) {
      setState(() {
        error = 'No access token found.';
        isLoading = false;
      });
      return;
    }
<<<<<<< HEAD

    try {
      final response = await http.get(
        Uri.parse('http://127.0.0.1:8000/api/patient/me/'),
        headers: {'Authorization': 'Bearer $token'},
      );

=======
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
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
      if (response.statusCode == 200) {
        setState(() {
          profile = jsonDecode(response.body);
          isLoading = false;
        });
      } else {
        setState(() {
<<<<<<< HEAD
          error = 'Failed: ${response.statusCode}';
=======
          error = 'Failed to load profile: ${response.statusCode}';
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
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
<<<<<<< HEAD
        title: const Text("Patient Home"),
        backgroundColor: Colors.indigo,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => Navigator.pushReplacementNamed(context, '/'),
=======
        title: const Text('Patient Home'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/');
            },
            tooltip: 'Logout',
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
          ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
<<<<<<< HEAD
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
=======
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
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CircleAvatar(
                              radius: 32,
<<<<<<< HEAD
                              backgroundColor: Colors.indigo.shade200,
                              child: const Icon(Icons.person,
                                  size: 38, color: Colors.white),
=======
                              backgroundColor: Colors.blue.shade200,
                              child: Icon(Icons.person, size: 38, color: Colors.white),
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
                            ),
                            const SizedBox(width: 20),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
<<<<<<< HEAD
                                  Text("Hello, ${profile?['username'] ?? 'Patient'}",
                                      style: const TextStyle(
                                          fontSize: 22,
                                          fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 6),
=======
                                  Text(
                                    'Hello, ${profile?['username'] ?? 'Patient'}',
                                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                                  ),
                                  const SizedBox(height: 8),
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
                                  Text('Gender: ${profile?['gender'] ?? 'N/A'}'),
                                  Text('Age: ${profile?['age'] ?? 'N/A'}'),
                                  Text('Address: ${profile?['address'] ?? 'N/A'}'),
                                  Text('Emergency Contact: ${profile?['emergency_contact'] ?? 'N/A'}'),
                                ],
                              ),
<<<<<<< HEAD
                            )
=======
                            ),
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
<<<<<<< HEAD
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
=======
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
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
    );
  }
}

class _HomeFeatureButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

<<<<<<< HEAD
  const _HomeFeatureButton(
      {required this.icon, required this.label, required this.onTap, super.key});
=======
  const _HomeFeatureButton({
    required this.icon,
    required this.label,
    required this.onTap,
    super.key,
  });
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          CircleAvatar(
            radius: 28,
<<<<<<< HEAD
            backgroundColor: Colors.indigo.shade100,
            child: Icon(icon, size: 30, color: Colors.indigo.shade700),
          ),
          const SizedBox(height: 6),
          Text(label,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
=======
            backgroundColor: Colors.blue.shade100,
            child: Icon(icon, size: 32, color: Colors.blue.shade700),
          ),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
        ],
      ),
    );
  }
}
