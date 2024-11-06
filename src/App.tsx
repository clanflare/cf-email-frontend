import React, { useRef } from 'react';
import EmailEditor, { EmailEditorProps, EditorRef } from 'react-email-editor';
const App: React.FC = () => {
  const emailEditorRef = useRef<EditorRef>(null);

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data) => {
      const { html } = data;
      console.log('HTML Output:', html);
      // Here, you could add the email-sending logic using the html content.

    });
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
      <div >
        <EmailEditor ref={emailEditorRef} options={{
          appearance: {
            theme: 'modern_dark'
          },
          projectId: 255723, //to be changed with client specific template in the future
          templateId: 566036
        }} style={{ height: 'calc(100vh - 100px)' }}
        />
      </div>
    </div>
  );
};

export default App;
