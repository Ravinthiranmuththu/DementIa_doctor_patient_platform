import 'package:flutter/material.dart';

class RecordingsPage extends StatelessWidget {
  // Example mock data; replace with API data in the future
  final List<Map<String, dynamic>> recordings = const [
    {
      'id': 1,
      'word': 'apple',
      'date': '2023-05-10',
      'accuracy': 75,
      'url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      'id': 2,
      'word': 'banana',
      'date': '2023-05-12',
      'accuracy': 82,
      'url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      'id': 3,
      'word': 'cat',
      'date': '2023-05-15',
      'accuracy': 68,
      'url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
  ];

  const RecordingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Recordings')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: recordings.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final rec = recordings[index];
          return Card(
            elevation: 2,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: ListTile(
              title: Text(rec['word'], style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Date: ${rec['date']}'),
                  Text('Accuracy: ${rec['accuracy']}%'),
                ],
              ),
              trailing: IconButton(
                icon: const Icon(Icons.play_arrow, color: Colors.blue),
                onPressed: () {
                  // TODO: Implement audio playback
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Play audio: ${rec['word']}')),
                  );
                },
              ),
            ),
          );
        },
      ),
    );
  }
}
