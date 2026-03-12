import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import { FaDownload, FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
`;

const UploadSection = styled.div`
  margin-bottom: 30px;
`;

const FileInput = styled.input`
  margin-top: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #f5f5f5;
  }

  td svg {
    cursor: pointer;
    margin-right: 10px;
    transition: transform 0.2s ease-in-out;
  }

  td svg:hover {
    transform: scale(1.2);
  }

  img {
    max-width: 120px;
    height: auto;
    border-radius: 4px;
  }

  iframe {
    border: none;
    width: 150px;
    height: 120px;
  }
`;

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempName, setTempName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setDocuments((prev) => [...prev, { name: file.name, url, file }]);
    toast.success(`File "${file.name}" uploaded successfully!`, { position: "bottom-right" });
  };

  const handleDelete = (index) => {
    const fileName = documents[index].name;
    setDocuments((prev) => prev.filter((_, i) => i !== index));
    toast.error(`File "${fileName}" deleted successfully!`, { position: "bottom-right" });
  };

  const handleDownload = (file) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    toast.info(`File "${file.name}" downloaded!`, { position: "bottom-right" });
  };

  const handleRenameStart = (index) => {
    setEditingIndex(index);
    setTempName(documents[index].name);
  };

  const handleRenameSave = (index) => {
    if (!tempName.trim()) {
      toast.warn("File name cannot be empty!", { position: "bottom-right" });
      return;
    }
    setDocuments((prev) =>
      prev.map((doc, i) =>
        i === index ? { ...doc, name: tempName } : doc
      )
    );
    setEditingIndex(null);
    toast.success(`File renamed to "${tempName}"`, { position: "bottom-right" });
  };

  return (
    <PageContainer>
      
      <Content>
        <h2>My Files</h2>

        <UploadSection>
          <label htmlFor="fileUpload">Upload a document (PDF or image):</label>
          <FileInput
            id="fileUpload"
            type="file"
            accept=".pdf, .png, .jpg, .jpeg"
            onChange={handleFileUpload}
          />
        </UploadSection>

        <Table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, idx) => (
              <tr key={idx}>
                <td>
                  {editingIndex === idx ? (
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      style={{ padding: "4px" }}
                    />
                  ) : (
                    doc.name
                  )}
                </td>
                <td>
                  {doc.file.type === 'application/pdf' ? (
                    <iframe src={doc.url} title="PDF Preview" />
                  ) : (
                    <img src={doc.url} alt={doc.name} />
                  )}
                </td>
                <td>
                  <FaDownload
                    className="text-primary"
                    onClick={() => handleDownload(doc.file)}
                    title="Download"
                  />
                  {editingIndex === idx ? (
                    <FaSave
                      className="text-success"
                      onClick={() => handleRenameSave(idx)}
                      title="Save"
                    />
                  ) : (
                    <FaEdit
                      className="text-warning"
                      onClick={() => handleRenameStart(idx)}
                      title="Rename"
                    />
                  )}
                  <FaTrash
                    className="text-danger"
                    onClick={() => handleDelete(idx)}
                    title="Delete"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Content>

      <ToastContainer />
    </PageContainer>
  );
};

export default Documents;
