import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import { FaDownload, FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL;

const Content = styled.div`flex: 1; padding: 40px; overflow-y: auto;`;
const UploadSection = styled.div`margin-bottom: 30px;`;

const Table = styled.table`
  width: 100%; border-collapse: collapse;
  th, td { padding: 12px; border: 1px solid #ddd; text-align: left; vertical-align: middle; }
  th { background-color: #f5f5f5; }
  td svg { cursor: pointer; margin-right: 10px; transition: transform 0.2s ease-in-out; }
  td svg:hover { transform: scale(1.2); }
  img { max-width: 120px; height: auto; border-radius: 4px; }
  iframe { border: none; width: 150px; height: 120px; }
`;

const UploadButton = styled.label`
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 0.5rem;
  &:hover { opacity: 0.9; }
`;

const HiddenInput = styled.input`display: none;`;

const Spinner = styled.div`
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const MyFiles = () => {
  const [documents, setDocuments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('authToken');
  const headers = { Authorization: `Bearer ${token}` };

  // ✅ Load files from MongoDB on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/my-files`, { headers });
      const data = await res.json();
      if (res.ok) setDocuments(data);
    } catch (err) {
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Upload file to MongoDB via backend
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_URL}/api/my-files`, {
        method: 'POST',
        headers, // ✅ no Content-Type — let browser set it for FormData
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`"${file.name}" uploaded and saved!`);
        fetchFiles(); // reload list
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Network error during upload');
    } finally {
      setUploading(false);
      e.target.value = ''; // reset input
    }
  };

  // ✅ Delete file from MongoDB
  const handleDelete = async (id, name) => {
    try {
      const res = await fetch(`${API_URL}/api/my-files/${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d._id !== id));
        toast.error(`"${name}" deleted!`);
      }
    } catch (err) {
      toast.error('Failed to delete file');
    }
  };

  // ✅ Download file from MongoDB
  const handleDownload = async (id, name) => {
    try {
      const res = await fetch(`${API_URL}/api/my-files/${id}`, { headers });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
      toast.info(`Downloading "${name}"`);
    } catch (err) {
      toast.error('Download failed');
    }
  };

  // ✅ Rename — updates name locally (no separate rename endpoint needed)
  const handleRenameStart = (id, currentName) => {
    setEditingId(id);
    setTempName(currentName);
  };

  const handleRenameSave = (id) => {
    if (!tempName.trim()) {
      toast.warn('File name cannot be empty!');
      return;
    }
    setDocuments(prev => prev.map(d => d._id === id ? { ...d, name: tempName } : d));
    setEditingId(null);
    toast.success(`Renamed to "${tempName}"`);
  };

  // ✅ Get preview URL for a file from backend
  const getPreviewUrl = (id) => `${API_URL}/api/my-files/${id}?token=${token}`;

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Content>
      <h2>My Files</h2>
      <p style={{ color: '#888', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Files are securely saved to your account and persist across sessions.
      </p>

      <UploadSection>
        <div>Upload a document (PDF or image, max 10MB):</div>
        <UploadButton htmlFor="fileUpload">
          {uploading ? <><Spinner />Uploading...</> : '📂 Choose File'}
        </UploadButton>
        <HiddenInput
          id="fileUpload"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileUpload}
          disabled={uploading}
        />
      </UploadSection>

      {loading ? (
        <p style={{ color: '#888' }}>Loading files...</p>
      ) : documents.length === 0 ? (
        <p style={{ color: '#888' }}>No files uploaded yet.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Size</th>
              <th>Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id}>
                <td>
                  {editingId === doc._id
                    ? <input
                        type="text"
                        value={tempName}
                        onChange={e => setTempName(e.target.value)}
                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    : doc.name}
                </td>
                <td style={{ color: '#888', fontSize: '0.85rem' }}>
                  {formatSize(doc.size)}
                </td>
                <td>
                  {doc.type === 'application/pdf'
                    ? <iframe
                        src={`${API_URL}/api/my-files/${doc._id}`}
                        title="PDF Preview"
                        style={{ border: 'none', width: '150px', height: '120px' }}
                      />
                    : <img
                        src={`${API_URL}/api/my-files/${doc._id}`}
                        alt={doc.name}
                        style={{ maxWidth: '120px', height: 'auto', borderRadius: '4px' }}
                      />
                  }
                </td>
                <td>
                  <FaDownload
                    style={{ color: '#2990fc' }}
                    onClick={() => handleDownload(doc._id, doc.name)}
                    title="Download"
                  />
                  {editingId === doc._id
                    ? <FaSave
                        style={{ color: '#22c55e' }}
                        onClick={() => handleRenameSave(doc._id)}
                        title="Save name"
                      />
                    : <FaEdit
                        style={{ color: '#f59e0b' }}
                        onClick={() => handleRenameStart(doc._id, doc.name)}
                        title="Rename"
                      />
                  }
                  <FaTrash
                    style={{ color: '#ef4444' }}
                    onClick={() => handleDelete(doc._id, doc.name)}
                    title="Delete"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ToastContainer position="bottom-right" autoClose={2000} />
    </Content>
  );
};

export default MyFiles;