import React, { useRef, useState } from 'react';
import EmailEditor, {  EditorRef } from 'react-email-editor';

const App: React.FC = () => {
  const emailEditorRef = useRef<EditorRef>(null);
  const [showSendModal, setShowSendModal] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    from: '',
    subject: '',
    to: '',
    sendSeparately: false,
  });
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [plainTextContent, setPlainTextContent] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, sendSeparately: e.target.checked });
  };

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data) => {
      const htmlData = data.html;
      setHtmlContent(htmlData);
      unlayer.exportPlainText((data)=>{
        setPlainTextContent(data.text);
      })
    });
    setShowSendModal(true);
  };

  const handleSendEmail = async () => {
    const { from, subject, to } = formValues;

    try {
      const response = await fetch('https://63msl6ebsb.execute-api.ap-south-1.amazonaws.com/send-email', {//use api from env later
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: from,
          destination: to.split(',').map(email => email.trim()), // Split and trim multiple recipients
          subject: subject,
          bodyText: plainTextContent,
          bodyHtml: htmlContent,
        }),
      });

      if (response.ok) {
        alert('Email sent successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setShowSendModal(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '60px', padding: '5px' }}>
        <button
          onClick={exportHtml}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '200px',
            alignSelf: 'center'
          }}
        >
          Send Email
        </button>
      </div>
      <div>
        <EmailEditor
          ref={emailEditorRef}
          options={{
            appearance: {
              theme: 'modern_dark',
            },
            projectId: 255988,
            templateId: 566726,
          }}
          style={{ height: 'calc(100vh - 100px)' }}
        />
      </div>

      {showSendModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h2>Send Email</h2>
            <label>
              From:
              <input
                type="text"
                name="from"
                value={formValues.from}
                onChange={handleInputChange}
                style={modalStyles.input}
              />
            </label>
            <label>
              Subject:
              <input
                type="text"
                name="subject"
                value={formValues.subject}
                onChange={handleInputChange}
                style={modalStyles.input}
              />
            </label>
            <label>
              To:
              <input
                type="text"
                name="to"
                value={formValues.to}
                onChange={handleInputChange}
                style={modalStyles.input}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={formValues.sendSeparately}
                onChange={handleCheckboxChange}
              />
              Send separately
            </label>
            <button onClick={handleSendEmail} style={modalStyles.sendButton}>
              Send
            </button>
            <button onClick={() => setShowSendModal(false)} style={modalStyles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for the modal
const modalStyles: {
  overlay: React.CSSProperties;
  modal: React.CSSProperties;
  input: React.CSSProperties;
  sendButton: React.CSSProperties;
  cancelButton: React.CSSProperties;
} = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '10px',
  },
  input: {
    width: '55%',
    padding: '8px',
    marginTop: '5px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  sendButton: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default App;
