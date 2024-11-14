import React, { useState } from 'react';
import axios from 'axios';
import Tesseract from 'tesseract.js';
import { Button, Spinner, Form, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/stylesheets/FileUpload.css'; // Import the CSS file



const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState(null);

    const [numParticipants, setNumParticipants] = useState(1);
    const [participants, setParticipants] = useState([{ name: '', role: '' }]);

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleNumParticipantsChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setNumParticipants(value);

        const updatedParticipants = [];
        for (let i = 0; i < value; i++) {
            updatedParticipants.push({ name: participants[i]?.name || '', role: i === 0 ? 'Sender' : 'Receiver' });
        }
        setParticipants(updatedParticipants);
    };

    const handleParticipantNameChange = (index, e) => {
        const updatedParticipants = [...participants];
        updatedParticipants[index].name = e.target.value;
        setParticipants(updatedParticipants);
    };

    const [receiverName, setReceiverName] = useState('');
    const [senderName, setSenderName] = useState('');

    const handleReceiverNameChange = (e) => {
        setReceiverName(e.target.value);
        console.log("Receiver Name:", e.target.value);
    }

    const handleSenderNameChange = (e) => {
        setSenderName(e.target.value);
        console.log("Sender Name:", e.target.value);
    }

    const analyzeConversation = async (text, participantList) => {
        try {
            const senderName = participantList[0]
            const receiverName = participantList[1]
            console.log(participantList[0] || "Sender");
            console.log(participantList[1] || "Receiver");

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'user',
                            content: `Please analyze the following conversation between ${senderName} and ${receiverName}. Provide a brief report that covers the following elements in a one or two sentences each:

                            Participant Identification:
                            - Sender: ${senderName}
                            - Receiver: ${receiverName}
                            - Genders: Determine the genders of ${senderName} and ${receiverName}, if possible.
                            - Relationship Context: Describe the relationship between the participants (e.g., friends, colleagues, romantic partners).
                            
                            Toxicity Analysis:
                            - Toxicity Level: Assign a toxicity score on a scale from 0 (not toxic) to 10 (extremely toxic) for the conversation as a whole and for each participant individually.
                            - Definition of Toxicity: Briefly define what constitutes toxicity in this context.
                            - Examples from Conversation: Highlight key messages or phrases that contribute to the toxicity score.
                            
                            Red Flags Detection:
                            - Identify Red Flags: List any psychological or emotional red flags observed.
                            - Explanation: Briefly explain why each red flag is concerning.
                            - Impact Assessment: Discuss the potential impact on ${receiverName}'s emotional well-being.
                            
                            Emotional Intelligence Assessment:
                            - Emotional Tone: Summarize the emotional tone of the messages.
                            - Empathy Levels: Assess the level of empathy displayed by ${senderName}.
                            - Communication Style: Describe the communication styles used.
                            
                            Psychological Insights:
                            - Behavior Patterns: Note any patterns suggesting psychological issues.
                            - Conflict Resolution Skills: Evaluate how conflicts are addressed.
                            - Recommendations: Suggest steps ${receiverName} could take for healthier communication.
                            
                            Overall Summary:
                            - Concise Summary: Summarize the key findings.
                            - Actionable Advice: Offer practical advice or resources for ${receiverName}.
                            
                            Additional Considerations:
                            - Cultural Context: Mention any cultural factors influencing communication.
                            - Language Nuances: Note any sarcasm, humor, or expressions affecting interpretation.
                            
                            Formatting and Presentation:
                            - Clear Structure: Organize the report into the sections above. Keep the titles and dont use labels.
                            - Professional Tone: Use objective and non-judgmental language.
                            - Confidentiality: Respect the privacy of the individuals involved.
                            
                            Note: Base the analysis solely on the provided conversation without making assumptions beyond the available information.
                            
                            
                            The conversation text is as follows:
    "${text}"`,
                        },
                    ],
                    max_tokens: 1500,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`, // Replace with your OpenAI API key
                    },
                }
            );
            console.log("OpenAI API Response:", response);

            const analysisText = response.data.choices[0].message.content.trim();
            console.log("Analysis Text:", analysisText);

            // Parse the toxicity scores from the analysisText
            let participant1Toxicity = 0;
            let participant2Toxicity = 0;
            let toxicityMeter = 0;

            // Extract toxicity scores using regex
            const toxicityLevelMatch = analysisText.match(/Toxicity Level:[\s\S]*?Assign a toxicity score on a scale[\s\S]*?\n([\s\S]*?)\n\n/);
            if (toxicityLevelMatch) {
                const toxicityLevelText = toxicityLevelMatch[1];

                // Extract overall toxicity score
                const overallToxicityMatch = toxicityLevelText.match(/Conversation as a whole:\s*(\d+)/i);
                if (overallToxicityMatch) {
                    toxicityMeter = parseInt(overallToxicityMatch[1]);
                }

                // Extract individual toxicity scores
                const participant1ToxicityMatch = toxicityLevelText.match(new RegExp(`${senderName}:\\s*(\\d+)`, 'i'));
                if (participant1ToxicityMatch) {
                    participant1Toxicity = parseInt(participant1ToxicityMatch[1]);
                }

                const participant2ToxicityMatch = toxicityLevelText.match(new RegExp(`${receiverName}:\\s*(\\d+)`, 'i'));
                if (participant2ToxicityMatch) {
                    participant2Toxicity = parseInt(participant2ToxicityMatch[1]);
                }
            }

            // Parse the response to extract the analysis sections
            const participantIdentificationMatch = analysisText.match(/Participant Identification:\n([\s\S]*?)\n\n/);
            const toxicityAnalysisMatch = analysisText.match(/Toxicity Analysis:\n([\s\S]*?)\n\n/);
            const redFlagsDetectionMatch = analysisText.match(/Red Flags Detection:\n([\s\S]*?)\n\n/);
            const emotionalIntelligenceMatch = analysisText.match(/Emotional Intelligence Assessment:\n([\s\S]*?)\n\n/);
            const psychologicalInsightsMatch = analysisText.match(/Psychological Insights:\n([\s\S]*?)\n\n/);
            const overallSummaryMatch = analysisText.match(/Overall Summary:\n([\s\S]*?)\n\n/);
            const additionalConsiderationsMatch = analysisText.match(/Additional Considerations:\n([\s\S]*?)\n\n/);

            const participantIdentification = participantIdentificationMatch ? ` ${participantIdentificationMatch[1].split(':').pop().trim()}` : '';
            const toxicityAnalysis = toxicityAnalysisMatch ? ` ${toxicityAnalysisMatch[1].split(':').pop().trim()}` : '';
            const redFlagsDetection = redFlagsDetectionMatch ? ` ${redFlagsDetectionMatch[1].split(':').pop().trim()}` : '';
            const emotionalIntelligence = emotionalIntelligenceMatch ? ` ${emotionalIntelligenceMatch[1].split(':').pop().trim()}` : '';
            const psychologicalInsights = psychologicalInsightsMatch ? ` ${psychologicalInsightsMatch[1].split(':').pop().trim()}` : '';
            const overallSummary = overallSummaryMatch ? ` ${overallSummaryMatch[1].split(':').pop().trim()}` : '';
            const additionalConsiderations = additionalConsiderationsMatch ? ` ${additionalConsiderationsMatch[1].split(':').pop().trim()}` : '';

            setResults({
                text,
                analysis: analysisText,
                participants: [
                    { name: senderName, role: "Sender", toxicity: participant1Toxicity },
                    { name: receiverName, role: "Receiver", toxicity: participant2Toxicity }
                ],
                toxicityMeter,
                participantIdentification,
                toxicityAnalysis,
                redFlagsDetection,
                emotionalIntelligence,
                psychologicalInsights,
                overallSummary,
                additionalConsiderations
            });

            console.log("Results Set:", {
                text,
                analysis: analysisText,
                participants: [
                    { name: senderName, role: "Sender", toxicity: participant1Toxicity },
                    { name: receiverName, role: "Receiver", toxicity: participant2Toxicity }
                ],
                toxicityMeter,
                participantIdentification,
                toxicityAnalysis,
                redFlagsDetection,
                emotionalIntelligence,
                psychologicalInsights,
                overallSummary,
                additionalConsiderations
            });
        } catch (error) {
            console.error("Error calling OpenAI API:", error);
        }
    };


    const handleUpload = async () => {
        console.log("Upload started");
        setUploading(true);

        try {
            console.log("Processing files:", files);
            const results = await Promise.all(
                files.map(async (file) => {
                    console.log("Processing file:", file.name);
                    // Perform OCR on the uploaded image
                    const { data: { text } } = await Tesseract.recognize(file, 'eng');
                    console.log("OCR result text:", text);

                    const participantList = [senderName, receiverName]
                    console.log("Participant list:", participantList);

                    await analyzeConversation(text, participantList);
                    console.log("Conversation analyzed for file:", file.name);
                })
            );
            console.log("All files processed:", results);

        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setUploading(false);
            console.log("Upload finished");
        }
    };

    return (
        <div id="file-upload" className="file-upload-container" style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                opacity: 0.5,
                zIndex: -1
            }}></div>
            <h1 className="text-center mb-4 file-upload-title">Upload iMessage Screenshots</h1>
            <p className="text-center mb-4 file-upload-title">
                Please select the number of participants and their names, and upload the screenshots to analyze.
            </p>

            <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} sm={6}>
                        <Form.Label className="file-upload-label">Sender</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter sender's name"
                            className="file-upload-input"
                            
                            onChange={(e) => handleSenderNameChange(e)}
                        />
                    </Form.Group>

                    <Form.Group as={Col} sm={6}>
                        <Form.Label className="file-upload-label">Recipient</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter recipient's name"
                            className="file-upload-input"
                            
                            onChange={(e) => handleReceiverNameChange(e)}
                        />
                    </Form.Group>
                </Row>

      
                <Row className="mb-3">
                    <Form.Group as={Col} sm={12}>
                        <Form.Label className="file-upload-label">Upload Files</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="file-upload-input"
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Col sm={12}>
                        <Button
                            variant="primary"
                            onClick={handleUpload}
                            disabled={uploading || files.length === 0}
                            className="file-upload-button"
                        >
                            {uploading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Upload & Analyze'}
                        </Button>
                    </Col>
                </Row>
            </Form>

            {/* Results displayed above the screenshots */}
            {results && (
                <div className="mt-5 results-container">
                    <h2 className="text-center mb-4 file-upload-title">Analysis Results</h2>

                    {/* Toxicity Overall Score */}
                    <div className="text-center mb-4">
                        <h3 className="file-upload-title">Toxicity Overall Score: {results.toxicityMeter}/10</h3>
                        <ProgressBar
                            now={results.toxicityMeter * 10}
                            label={`${results.toxicityMeter}/10`}
                            className="toxicity-progress-bar"
                        />
                    </div>

                    <Row className="mb-4">
                        <Col md={6} className="mb-3">
                            <Card className="results-card">
                                <Card.Body>
                                    <Card.Title className="file-upload-title">Participant Identification</Card.Title>
                                    <Card.Text className="file-upload-text">
                                        <div className="pt-2"><strong className="result-label">Sender(s):</strong> <span className="result-text">{results.participantIdentification}</span></div>
                                        <div className="pt-2"><strong className="result-label">Receiver(s):</strong> <span className="result-text">{results.participantIdentification}</span></div>
                                        <div className="pt-2"><strong className="result-label">Genders:</strong> <span className="result-text">{results.participantIdentification}</span></div>
                                        <div className="pt-2"><strong className="result-label">Relationship Context:</strong> <span className="result-text">{results.participantIdentification}</span></div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Card className="results-card">
                                <Card.Body>
                                    <Card.Title className="file-upload-title">Toxicity Analysis</Card.Title>
                                    <Card.Text className="file-upload-text">
                                        <div className="pt-2"><strong className="result-label">Toxicity Level:</strong> <span className="result-text">{results.toxicityAnalysis}</span></div>
                                        <div className="pt-2"><strong className="result-label">Definition of Toxicity:</strong> <span className="result-text">{results.toxicityAnalysis}</span></div>
                                        <div className="pt-2"><strong className="result-label">Examples from Conversation:</strong> <span className="result-text">{results.toxicityAnalysis}</span></div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col md={6} className="mb-3">
                            <Card className="results-card">
                                <Card.Body>
                                    <Card.Title className="file-upload-title">Red Flags Detection</Card.Title>
                                    <Card.Text className="file-upload-text">
                                        <div className="pt-2"><strong className="result-label">Identify Red Flags:</strong> <span className="result-text">{results.redFlagsDetection}</span></div>
                                        <div className="pt-2"><strong className="result-label">Explanation:</strong> <span className="result-text">{results.redFlagsDetection}</span></div>
                                        <div className="pt-2"><strong className="result-label">Impact Assessment:</strong> <span className="result-text">{results.redFlagsDetection}</span></div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Card className="results-card">
                                <Card.Body>
                                    <Card.Title className="file-upload-title">Emotional Intelligence Assessment</Card.Title>
                                    <Card.Text className="file-upload-text">
                                        <div className="pt-2"><strong className="result-label">Emotional Tone:</strong> <span className="result-text">{results.emotionalIntelligence}</span></div>
                                        <div className="pt-2"><strong className="result-label">Empathy Levels:</strong> <span className="result-text">{results.emotionalIntelligence}</span></div>
                                        <div className="pt-2"><strong className="result-label">Communication Style:</strong> <span className="result-text">{results.emotionalIntelligence}</span></div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col md={6} className="mb-3">
                            <Card className="results-card">
                                <Card.Body>
                                    <Card.Title className="file-upload-title">Psychological Insights</Card.Title>
                                    <Card.Text className="file-upload-text">
                                        <div className="pt-2"><strong className="result-label">Behavior Patterns:</strong> <span className="result-text">{results.psychologicalInsights}</span></div>
                                        <div className="pt-2"><strong className="result-label">Conflict Resolution Skills:</strong> <span className="result-text">{results.psychologicalInsights}</span></div>
                                        <div className="pt-2"><strong className="result-label">Recommendations:</strong> <span className="result-text">{results.psychologicalInsights}</span></div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Card className="results-card">
                                <Card.Body>
                                    <Card.Title className="file-upload-title">Overall Summary</Card.Title>
                                    <Card.Text className="file-upload-text">
                                        <div className="pt-2"><strong className="result-label">Concise Summary:</strong> <span className="result-text">{results.overallSummary}</span></div>
                                        <div className="pt-2"><strong className="result-label">Actionable Advice:</strong> <span className="result-text">{results.overallSummary}</span></div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col md={6} className="mb-3">
                            <Card className="results-card">
                                <Card.Body>
                                    <Card.Title className="file-upload-title">Additional Considerations</Card.Title>
                                    <Card.Text className="file-upload-text">
                                        <div className="pt-2"><strong className="result-label">Cultural Context:</strong> <span className="result-text">{results.additionalConsiderations}</span></div>
                                        <div className="pt-2"><strong className="result-label">Language Nuances:</strong> <span className="result-text">{results.additionalConsiderations}</span></div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}

            {/* File previews displayed below the results */}
            <Row className="mt-3">
                {files.map((file, index) => (
                    <Col key={index} md={4} className="mb-3">
                        <Card>
                            <Card.Img variant="top" src={URL.createObjectURL(file)} alt={`File preview ${index}`} />
                            <Card.Body>
                                <Card.Text>{file.name}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default FileUpload;