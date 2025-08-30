// ignore_for_file: avoid_web_libraries_in_flutter, avoid_print
import 'dart:html' as html;
import 'dart:ui_web' as ui;
import 'dart:typed_data';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class RecordingsPage extends StatefulWidget {
  const RecordingsPage({super.key});

  @override
  State<RecordingsPage> createState() => _RecordingsPageState();
}

class _RecordingsPageState extends State<RecordingsPage> {
  html.MediaRecorder? _mediaRecorder;
  final List<html.Blob> _chunks = [];
  bool _isRecording = false;
  String? _audioUrl;
  DateTime? _startTime;
  final storage = const FlutterSecureStorage();
  bool _isUploading = false;
  List<Map<String, dynamic>> _recordings = [];

  @override
  void initState() {
    super.initState();
    _fetchRecordings();
  }

  Future<void> _fetchRecordings() async {
    try {
      final token = await storage.read(key: 'access');
      if (token == null) return;

      final response = await http.get(
        Uri.parse('http://127.0.0.1:8000/api/patient/my-recordings/'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> recordingsJson = json.decode(response.body);
        setState(() {
          _recordings = recordingsJson
              .map((rec) => rec as Map<String, dynamic>)
              .toList();
        });
      }
    } catch (e) {
      debugPrint('Error fetching recordings: $e');
    }
  }

  Future<void> _startRecording() async {
    try {
      final stream =
          await html.window.navigator.mediaDevices!.getUserMedia({'audio': true});

      _mediaRecorder = html.MediaRecorder(stream);
      _chunks.clear();
      _startTime = DateTime.now();

      _mediaRecorder!.addEventListener('dataavailable', (event) {
        final blobEvent = event as html.BlobEvent;
        _chunks.add(blobEvent.data!);
      });

      _mediaRecorder!.addEventListener('stop', (event) async {
        final blob = html.Blob(_chunks, 'audio/webm');
        final url = html.Url.createObjectUrl(blob);
        setState(() {
          _audioUrl = url;
        });
        await _uploadRecording(blob);
      });

      _mediaRecorder!.start();
      setState(() => _isRecording = true);
    } catch (e) {
      debugPrint('Error starting recording: $e');
    }
  }

  void _stopRecording() {
    if (_mediaRecorder != null && _isRecording) {
      _mediaRecorder!.stop();
      setState(() => _isRecording = false);
    }
  }

  Future<void> _uploadRecording(html.Blob blob) async {
    setState(() => _isUploading = true);

    try {
      final token = await storage.read(key: 'access');
      if (token == null) return;

      final duration = DateTime.now().difference(_startTime!).inSeconds;
      final uri = Uri.parse('http://127.0.0.1:8000/api/recordings/upload/');
      final request = http.MultipartRequest('POST', uri);
      request.headers['Authorization'] = 'Bearer $token';

      final reader = html.FileReader();
      reader.readAsArrayBuffer(blob);
      await reader.onLoad.first;
      final bytes = reader.result as Uint8List;

      final file = http.MultipartFile.fromBytes(
        'recording_file',
        bytes,
        filename: 'recording_${DateTime.now().toIso8601String()}.webm',
        contentType: MediaType('audio', 'webm'),
      );
      request.files.add(file);
      request.fields['duration'] = duration.toString();

      final response = await request.send();
      if (response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Recording uploaded successfully!')),
        );
        await _fetchRecordings();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Upload failed: ${response.statusCode}')),
        );
      }
    } catch (e) {
      debugPrint('Error uploading: $e');
    } finally {
      setState(() => _isUploading = false);
    }
  }

  void _downloadRecording() {
    if (_audioUrl != null) {
      final anchor = html.AnchorElement(href: _audioUrl!)
        ..setAttribute('download', 'recording.webm')
        ..click();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_audioUrl != null) {
      ui.platformViewRegistry.registerViewFactory(
        'audio-player',
        (int viewId) {
          final audio = html.AudioElement()
            ..src = _audioUrl!
            ..controls = true;
          return audio;
        },
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Recordings'),
        backgroundColor: Colors.indigo,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF74EBD5), Color(0xFFACB6E5)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Column(
          children: [
            const SizedBox(height: 30),

            // Recording Controls
            Center(
              child: _isUploading
                  ? const CircularProgressIndicator()
                  : ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor:
                            _isRecording ? Colors.red : Colors.indigo,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                            vertical: 14, horizontal: 20),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      onPressed: _isRecording ? _stopRecording : _startRecording,
                      icon: Icon(_isRecording ? Icons.stop : Icons.mic),
                      label: Text(
                        _isRecording ? 'Stop Recording' : 'Start Recording',
                        style: const TextStyle(fontSize: 18),
                      ),
                    ),
            ),

            const SizedBox(height: 20),

            // Current Recording Preview
            if (_audioUrl != null) ...[
              const Text('Recorded Audio:',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.black87)),
              const SizedBox(height: 8),
              SizedBox(height: 50, child: HtmlElementView(viewType: 'audio-player')),
              const SizedBox(height: 10),
              ElevatedButton.icon(
                onPressed: _downloadRecording,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                icon: const Icon(Icons.download),
                label: const Text("Download"),
              ),
              const SizedBox(height: 20),
            ],

            const Divider(thickness: 1.2),
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: Text(
                'Previous Recordings',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),

            // Previous Recordings List
            Expanded(
              child: _recordings.isEmpty
                  ? const Center(child: Text('No recordings available'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(12),
                      itemCount: _recordings.length,
                      itemBuilder: (context, index) {
                        final recording = _recordings[index];
                        final date =
                            DateTime.parse(recording['created_at']).toLocal();

                        return Card(
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14)),
                          elevation: 5,
                          margin: const EdgeInsets.symmetric(vertical: 8),
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: Colors.indigo.shade100,
                              child: const Icon(Icons.audiotrack,
                                  color: Colors.indigo),
                            ),
                            title: Text('Recording ${index + 1}'),
                            subtitle: Text(
                              '${date.day}/${date.month}/${date.year} • ${recording['duration']} sec',
                            ),
                            trailing: IconButton(
                              icon: const Icon(Icons.play_arrow,
                                  color: Colors.indigo),
                              onPressed: () {
                                setState(() {
                                  _audioUrl = recording['recording_file'];
                                });
                              },
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
