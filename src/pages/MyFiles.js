// MyFiles.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import { FaDownload, FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const Content = styled.div`flex: 1; padding: 40px; overflow-y: auto;`;
const UploadSection = styled.div`margin-bottom: 30px;`;
const FileInput = styled.input`margin-top: 10px;`;
const Table = styled.table`
  width: 100%; border-collapse: collapse;
  th, td { padding: 12px; border: 1px solid #ddd; text-align: left; vertical-align: middle; }
  th { background-color: #f5f5f5; }
  td svg { cursor: pointer; margin-right: 10px; transition: transform 0.2s ease-in-out; }
  td svg:hover { transform: scale(1.2); }
  img { max-width: 120px; height: auto; border-radius: 4px; }
  iframe { border: none; width: 150px; height: 120px; }
`;

// Note: MyFiles stores files locally in browser memory only.
// For persistent file storage across sessions, Cloudinary or AWS S3 would be needed.
// Render's free tier has ephemeral storage so uploaded files would be lost on redeploy.

const MyFiles = () => {
  const [documents, setDocuments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempName, setTempName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10MB');
      return;
    }
    const url = URL.createObjectURL(file);
    setDocuments(prev => [...prev, { name: file.name, url, file }]);
    toast.success(`"${file.name}" uploaded!`, { position: 'bottom-right' });
  };

  const handleDelete = (index) => {
    const fileName = documents[index].name;
    setDocuments(prev => prev.filter((_, i) => i !== index));
    toast.error(`"${fileName}" deleted!`, { position: 'bottom-right' });
  };

  const handleDownload = (file) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    toast.info(`Downloading "${file.name}"`, { position: 'bottom-right' });
  };

  const handleRenameStart = (index) => {
    setEditingIndex(index);
    setTempName(documents[index].name);
  };

  const handleRenameSave = (index) => {
    if (!tempName.trim()) { toast.warn('File name cannot be empty!', { position: 'bottom-right' }); return; }
    setDocuments(prev => prev.map((doc, i) => i === index ? { ...doc, name: tempName } : doc));
    setEditingIndex(null);
    toast.success(`Renamed to "${tempName}"`, { position: 'bottom-right' });
  };

  return (
    <Content>
      <h2>My Files</h2>
      <p style={{ color: '#888', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Files are stored temporarily in your browser session. For permanent storage, they would need cloud storage integration.
      </p>

      <UploadSection>
        <label htmlFor="fileUpload">Upload a document (PDF or image, max 10MB):</label>
        <FileInput id="fileUpload" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} />
      </UploadSection>

      {documents.length === 0 ? (
        <p style={{ color: '#888' }}>No files uploaded yet.</p>
      ) : (
        <Table>
          <thead>
            <tr><th>File Name</th><th>Preview</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {documents.map((doc, idx) => (
              <tr key={idx}>
                <td>
                  {editingIndex === idx
                    ? <input type="text" value={tempName} onChange={e => setTempName(e.target.value)} style={{ padding: '4px' }} />
                    : doc.name}
                </td>
                <td>
                  {doc.file.type === 'application/pdf'
                    ? <iframe src={doc.url} title="PDF Preview" />
                    : <img src={doc.url} alt={doc.name} />}
                </td>
                <td>
                  <FaDownload style={{ color: '#2990fc' }} onClick={() => handleDownload(doc.file)} title="Download" />
                  {editingIndex === idx
                    ? <FaSave style={{ color: '#22c55e' }} onClick={() => handleRenameSave(idx)} title="Save" />
                    : <FaEdit style={{ color: '#f59e0b' }} onClick={() => handleRenameStart(idx)} title="Rename" />}
                  <FaTrash style={{ color: '#ef4444' }} onClick={() => handleDelete(idx)} title="Delete" />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <ToastContainer />
    </Content>
  );
};

export default MyFiles;