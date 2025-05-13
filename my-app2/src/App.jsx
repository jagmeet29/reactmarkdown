import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from 'remark-gfm';
import rehypeKatex from "rehype-katex";
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import "./App.css";
import "katex/dist/katex.min.css";


function App() {
  const [content, setContent] = useState("");
  const [parsedContent, setParsedContent] = useState([]);

  const fetchMarkdown = async () => {
    try {
      const res = await fetch("src/Page.md");
      const text = await res.text();
      setContent(text);
    } catch (err) {
      console.error('Problem reading markdown file', err);
    }
  };

  useEffect(() => {
    fetchMarkdown();
  }, []);

  useEffect(() => {
    if (content) {
      // Parse the markdown content manually to extract questions and answers
      const contentBlocks = [];
      let currentBlock = { type: "text", content: "" };
      
      const lines = content.split("\n");
      let inResQues = false;
      let inAns = false;
      let currentQuestion = "";
      let currentAnswer = "";
      lines.forEach(line => {
        if (line.trim() === ":::res-ques") {
          // Add any previous text block
          if (currentBlock.content.trim()) {
            contentBlocks.push({...currentBlock});
            currentBlock.content = "";
          }
          inResQues = true;
          return;
        }
        if (line.trim() === ":::ans") {
          inAns = true;
          return;
        }
        if (line.trim() === ":::" && inResQues) {
          inResQues = false;
          contentBlocks.push({
            type: "question",
            content: currentQuestion.trim()
          });
          currentQuestion = "";
          return;
        }
        if (line.trim() === ":::" && inAns) {
          inAns = false;
          contentBlocks.push({
            type: "answer",
            content: currentAnswer.trim()
          });
          currentAnswer = "";
          return;
        }
        if (inResQues) {
          currentQuestion += line + "\n";
        } else if (inAns) {
          currentAnswer += line + "\n";
        } else {
          currentBlock.content += line + "\n";
        }
      });

      // Add any remaining text block
      if (currentBlock.content.trim()) {
        contentBlocks.push(currentBlock);
      }
      
      setParsedContent(contentBlocks);
    }
  }, [content]);

  return (
    <>
      <div className="container">
         {parsedContent.map((block, index) => {
        if (block.type === "text") {
          return (
            <ReactMarkdown
              key={index}
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              children={block.content}
            />
          );
        } else if (block.type === "question") {
          return (
            <div key={index} className="res-ques">
              {block.content}
            </div>
          );
        } else if (block.type === "answer") {
          return <AnswerBlock key={index} answer={block.content} />;
        }
        return null;
      })}
    </div>
    </>
  );
}

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


export default App;
