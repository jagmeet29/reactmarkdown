import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from 'remark-gfm';
import rehypeKatex from "rehype-katex";
import rehypeRaw from 'rehype-raw';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import "katex/dist/katex.min.css";
import "./App.css";

// Import components
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';

// Import hooks and services
import { useDelayedLoading } from './hooks/useDelayedLoading';
import LoadingScreen from './components/LoadingScreen';

// Import contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Hook: load all markdown topics dynamically
function useTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // List of all markdown files in the topics directory
        // Vite's import.meta.glob for dynamically importing all .md files
        // Use query: '?raw' instead of as: 'raw' to fix deprecation warning
        const files = import.meta.glob('./topics/*.md', { eager: false, query: '?raw' });
        
        // Create topic entries without loading the content yet
        const topicEntries = Object.keys(files).map(path => {
          const fileName = path.split('/').pop().replace('.md', '');
          return {
            id: fileName.toLowerCase(),
            title: fileName.charAt(0).toUpperCase() + fileName.slice(1),
            path: path, // Store the path for lazy loading
            notes: null, // Content will be loaded on demand
            loadContent: files[path] // Store the import function
          };
        });
        
        console.log('Available topics:', topicEntries);
        setTopics(topicEntries);
      } catch (error) {
        console.error('Error loading topic list:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  return { 
    topics, 
    loading,    // Function to load a specific topic's content
    loadTopicContent: async (topicId) => {
      try {
        const topic = topics.find(t => t.id === topicId);
        if (!topic) return null;
        
        // If content is already loaded, return the topic
        if (topic.notes) return topic;
        
        try {
          // Load the content
          const content = await topic.loadContent();
          
          // Handle the new format which returns { default: content } with query: '?raw'
          const contentText = typeof content === 'object' && content.default ? content.default : content;
          
          console.log(`Content loaded for ${topicId}:`, contentText ? 'success' : 'empty');
          
          // Update the topics array with the loaded content
          setTopics(prevTopics => 
            prevTopics.map(t => 
              t.id === topicId ? { ...t, notes: contentText } : t
            )
          );
          
          // Return the updated topic
          return { ...topic, notes: contentText };
        } catch (loadError) {
          console.error(`Error in content loading for topic ${topicId}:`, loadError);
          return topic; // Return the topic even without content to prevent blocking the UI
        }
      } catch (error) {
        console.error(`Error loading content for topic ${topicId}:`, error);
        return null;
      }
    }
  };
}

// Parse markdown into blocks: text, question, answer
function parseContent(content) {
  const blocks = [];
  let current = { type: 'text', content: '' };
  let inQ = false, inA = false;
  let q = '', a = '';
  content.split('\n').forEach(line => {
    if (line.trim() === ':: :question:') {
      if (current.content.trim()) { blocks.push({ ...current }); current.content = ''; }
      inQ = true; return;
    }
    if (line.trim() === ':: :ok_hand:') { inA = true; return; }
    if (line.trim() === ':: :' && inQ) { inQ = false; blocks.push({ type: 'question', content: q.trim() }); q = ''; return; }
    if (line.trim() === ':: :' && inA) { inA = false; blocks.push({ type: 'answer', content: a.trim() }); a = ''; return; }
    if (inQ) { q += line + '\n'; }
    else if (inA) { a += line + '\n'; }
    else { current.content += line + '\n'; }
  });
  if (current.content.trim()) blocks.push(current);
  return blocks;
}

// Component: List of topics
function TopicList() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { topics, loading: topicsLoading } = useTopics();
  // Ensure loading animation runs at least 1 second
  const [loading, stopLoading] = useDelayedLoading(true, 2000);
  
  useEffect(() => {
    if (!topicsLoading) {
      stopLoading();
    }
  }, [topicsLoading, stopLoading]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <>
      {/* Spinner overlay while loading */}
      {loading && <LoadingScreen />}
      <div style={{ display: 'flex', height: `50px` }}>
        <div style={{ marginLeft: `auto`, marginRight: `10px`, height: `1.3rem` }} className="user-info">
          <span>Welcome, {user.username} </span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
      <div className="container">
        <div className="header">
          <h1 style={{marginBottom:`.0rem`}}>Topics</h1>
        </div>
        {/* Always render list or empty state */}
        {topics.length > 0 ? (
          <ul className="topic-list" >
            {topics.map(t => (
              <li key={t.id} style={{paddingBottom:`.5rem`}}>
                <Link to={`/topics/${t.id}`}>{t.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div>No topics found</div>
        )}
      </div>
    </>
  );
}

// Component: question-answer block
function AnswerBlock({ answer }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="answer-container">
      <button
        className="ans-button"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? "Hide Answer" : "Show Answer"}
      </button>
      <div className={`ans-content ${isVisible ? 'show' : ''}`}>
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {answer}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// Component: show topic details
function TopicDetail() {
  const { topicId } = useParams();
  const { topics, loading: topicsLoading, loadTopicContent } = useTopics();
  const [topic, setTopic] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [contentLoading, stopContentLoading, startContentLoading] = useDelayedLoading(false, 2000);

  // Load content when topics finish loading and topic exists
  useEffect(() => {
    if (topicsLoading) return;
    const found = topics.find(t => t.id === topicId);
    if (!found) {
      // No such topic
      stopContentLoading();
      return;
    }
    // Load the topic content once
    startContentLoading();
    (async () => {
      const loaded = await loadTopicContent(topicId);
      if (loaded) {
        setTopic(loaded);
        setBlocks(parseContent(loaded.notes));
      }
    })().finally(() => {
      stopContentLoading();
    });
    // Only run when topicsLoading or topicId change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicsLoading, topicId]);

  // Show loading screen while either topics or content are loading
  if (topicsLoading || contentLoading) return <LoadingScreen />;
  if (!topic) return <div>Topic not found.</div>;

  return (<>
      <div className="header">

        <h1 style={{padding:`0px`,margin:`10px`, fontSize:`1.5rem`}}>{topic.title}</h1> 
        
        <div style={{paddingRight:`15px`}}><Link to="/topics" >
        &larr; Back to Topics
        </Link>
        </div>
      
      </div>
    <div className="container ">
    
    
      {blocks.map((b, i) => {
        if (b.type === 'text') {
          return (
            <ReactMarkdown
              key={i}
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
            >
              {b.content}
            </ReactMarkdown>
          );
        }
        if (b.type === 'question') {
          return (
            <div key={i} className="res-ques">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
              >
                {b.content}
              </ReactMarkdown>
            </div>
          );
        }
        if (b.type === 'answer') {
          return <AnswerBlock key={i} answer={b.content} />;
        }
        return null;
      })}
     
    </div>
    <div style={{ display: 'flex', height:`50px`}}>
     <Link to="/topics" style={{marginLeft:`auto`, marginRight:`10px`, height:`1.3rem`}}>
        &larr; Back to Topics
      </Link></div>
      
    </>
  );
}

// Main App with routing
export default function App() {  
  // Log the current base path to help with debugging
  console.log('Base URL from Vite:', import.meta.env.BASE_URL);
  
  return (
    <div id="root">
      <div>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <TopicList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/topics" 
              element={
                <ProtectedRoute>
                  <TopicList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/topics/:topicId" 
              element={
                <ProtectedRoute>
                  <TopicDetail />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </div>

      <footer className="footer">
        <div style={{padding:`10px`}}>
          &copy; 2025 Jagmeet Singh. All rights reserved.<br/>
          <br/>
          <pre style={{padding:`0px`,margin:`0px`, fontFamily:`arial`, fontSize:`.75rem`}}>By
            Jagmeet Singh   <a href="mailto:nekjaggi@gmail.com" style={{margin:`0px`}}> nekjaggi@gmail.com</a>
          </pre>

          <p>This website is created for educational purposes only. All rights reserved.<br/>
            This website is not affiliated with any organization or institution.<br/>
            This website is not responsible for any errors or omissions in the content.
          </p>
        </div>
      </footer>
    </div>
  );
}
