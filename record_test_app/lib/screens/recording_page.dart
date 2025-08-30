// ignore_for_file: avoid_web_libraries_in_flutter
import 'dart:html' as html;
import 'dart:ui_web' as ui; // Correct import for platformViewRegistry in Flutter Web

import 'package:flutter/material.dart';

class RecordingPage extends StatefulWidget {
  const RecordingPage({Key? key}) : super(key: key);

  @override
  State<RecordingPage> createState() => _RecordingPageState();
}

class _RecordingPageState extends State<RecordingPage> {
  html.MediaRecorder? _mediaRecorder;
  final List<html.Blob> _chunks = [];
  bool _isRecording = false;
  String? _audioUrl;

  Future<void> _startRecording() async {
    try {
      final stream = await html.window.navigator.mediaDevices!
          .getUserMedia({'audio': true});

      _mediaRecorder = html.MediaRecorder(stream);
      _chunks.clear();

      _mediaRecorder!.addEventListener('dataavailable', (event) {
        final blobEvent = event as html.BlobEvent;
        _chunks.add(blobEvent.data!);
      });

      _mediaRecorder!.addEventListener('stop', (event) {
        final blob = html.Blob(_chunks, 'audio/webm');
        final url = html.Url.createObjectUrl(blob);
        setState(() {
          _audioUrl = url;
        });
      });

      _mediaRecorder!.start();
      setState(() {
        _isRecording = true;
      });
    } catch (e) {
      debugPrint('Error starting recording: $e');
    }
  }

  void _stopRecording() {
    _mediaRecorder?.stop();
    setState(() {
      _isRecording = false;
    });
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
    // Register HTML audio player view
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
      appBar: AppBar(title: const Text('Web Audio Recorder')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: _isRecording ? _stopRecording : _startRecording,
              child: Text(_isRecording ? 'Stop Recording' : 'Start Recording'),
            ),
            const SizedBox(height: 20),
            if (_audioUrl != null) ...[
              const Text('Recorded Audio:'),
              SizedBox(
                height: 50,
                child: HtmlElementView(viewType: 'audio-player'),
              ),
              const SizedBox(height: 10),
              ElevatedButton(
                onPressed: _downloadRecording,
                child: const Text('Download Recording'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
